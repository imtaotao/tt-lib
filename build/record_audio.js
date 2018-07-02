import { AudioCtx, download, inlineWorker, logError } from './utils';
function workerBody() {
    var _self = this;
    var config = {
        bufferLen: 4096,
        numChannels: 2,
        mimeType: 'audio/wav',
    };
    var recordBuffer = [];
    _self.onmessage = function (e) {
        switch (e.data.command) {
            case 'record':
                recordData(e.data.val);
                break;
            case 'exportWAV':
                exportWAV();
                break;
        }
    };
    function recordData(inputBuffer) {
        var numChannels = config.numChannels;
        for (var i = 0; i < numChannels; i++) {
            if (!recordBuffer[i]) {
                recordBuffer[i] = [];
            }
            recordBuffer[i].push(inputBuffer[i]);
        }
    }
    function exportWAV() {
        var collectRecord = collect();
        var audioBlob = createAudioBlob(collectRecord);
        recordBuffer = [];
        _self.postMessage({
            command: 'exportWAV',
            val: audioBlob,
        });
    }
    function createAudioBlob(collectRecord) {
        var numChannels = config.numChannels, mimeType = config.mimeType;
        var interleaveData = encodeWAV(44100, numChannels, collectRecord);
        return [
            new Blob([interleaveData], { type: mimeType }),
            interleaveData,
        ];
    }
    function collect() {
        var buffers = [];
        for (var i = 0; i < config.numChannels; i++) {
            buffers.push(mergeBuffers(recordBuffer[i]));
        }
        var length = buffers[0].length + buffers[1].length;
        var result = new Float32Array(length);
        var index = 0;
        var inputIndex = 0;
        while (index < length) {
            result[index++] = buffers[0][inputIndex];
            result[index++] = buffers[1][inputIndex];
            inputIndex++;
        }
        return result;
    }
    function mergeBuffers(buffers) {
        var result = new Float32Array(config.bufferLen * buffers.length);
        var offset = 0;
        for (var i = 0; i < buffers.length; i++) {
            result.set(buffers[i], offset);
            offset += buffers[i].length;
        }
        return result;
    }
    function encodeWAV(sampleRate, numChannels, samples) {
        var dataLength = samples.length * numChannels;
        var buffer = new ArrayBuffer(dataLength + 44);
        var view = new DataView(buffer);
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + dataLength, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * 2, true);
        view.setUint16(32, numChannels * 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, dataLength, true);
        floatTo16BitPCM(view, 44, samples);
        return view;
    }
    function floatTo16BitPCM(output, offset, input) {
        for (var i = 0; i < input.length; i++, offset += 2) {
            var s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }
    function writeString(view, offset, string) {
        for (var i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
}
var Record = (function () {
    function Record(filename, successFn, errorFn) {
        this.context = AudioCtx;
        this.volume = 1;
        this.worker = Record.inlineWorker(workerBody);
        this.recording = false;
        this.playing = false;
        this.config = {
            bufferLen: 4096,
            numChannels: 2,
        };
        this.filename = filename || 'record';
        this.successFn = successFn || (function () { });
        this.errorFn = errorFn || Record.logError;
        this.listenerWorker();
        this.createEnv();
    }
    Record.prototype.listenerWorker = function () {
        var _this = this;
        this.worker.onmessage = function (e) {
            switch (e.data.command) {
                case 'exportWAV':
                    _this.recordEnded(e.data.val);
                    break;
            }
        };
        this.worker.onerror = this.errorFn;
    };
    Record.prototype.recordEnded = function (_a) {
        var audioBlob = _a[0], interleaveData = _a[1];
        this.audioBlob = audioBlob;
        this.interleaveData = interleaveData.buffer;
        this.audio = null;
        this.recording = false;
        this.successFn();
    };
    Record.prototype.createEnv = function () {
        var _this = this;
        this.connectDevice()
            .then(function (stream) {
            var context = _this.context;
            var _a = _this.config, bufferLen = _a.bufferLen, numChannels = _a.numChannels;
            _this.recorder = context.createScriptProcessor(bufferLen, numChannels, numChannels);
            _this.audioInput = context.createMediaStreamSource(stream);
            _this.recorder.onaudioprocess = function (e) {
                var buffer = [];
                for (var channel = 0; channel < numChannels; channel++) {
                    buffer.push(e.inputBuffer.getChannelData(channel));
                }
                _this.worker.postMessage({
                    command: 'record',
                    val: buffer,
                });
            };
        });
    };
    Record.prototype.connectDevice = function () {
        return navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) { return stream; })
            .catch(this.errorFn);
    };
    Record.prototype.startRecord = function () {
        var _this = this;
        if (this.recording) {
            return this.errorFn("In recording");
        }
        var connect = function () {
            var _a = _this, audioInput = _a.audioInput, recorder = _a.recorder, context = _a.context;
            if (!audioInput) {
                setTimeout(connect);
                return;
            }
            _this.recording = true;
            _this.audioBlob = null;
            audioInput.connect(recorder);
            recorder.connect(context.destination);
        };
        connect();
    };
    Record.prototype.stopRecord = function () {
        if (!this.recording) {
            return this.errorFn("No recording");
        }
        this.recorder.disconnect();
        this.worker.postMessage({
            command: 'exportWAV'
        });
    };
    Record.prototype.play = function () {
        var _this = this;
        if (this.playing)
            return this.errorFn('Is playing');
        if (!this.audioBlob && !this.audio) {
            return this.errorFn("No audio resources");
        }
        this.playing = true;
        if (!this.audio) {
            this.audio = Record.createAudioElement(this.audioBlob);
            this.audio.volume = this.volume;
            this.audio.onended = function (e) {
                _this.playing = false;
            };
        }
        this.audio.play();
    };
    Record.prototype.pause = function () {
        if (!this.playing) {
            return this.errorFn('Not playing');
        }
        this.audio.pause();
        this.playing = false;
    };
    Record.prototype.download = function () {
        if (this.recording)
            return this.errorFn("In recording");
        if (!this.audioBlob)
            return this.errorFn("Audio blob is [" + this.audioBlob + "]");
        Record.download(this.audioBlob, this.filename + '.wav');
    };
    Record.logError = function (infor, isErr) {
        logError('Record', infor, isErr);
    };
    Record.inlineWorker = function (func) {
        return inlineWorker(func);
    };
    Record.download = function (blob, filename) {
        download(blob, filename);
    };
    Record.createAudioElement = function (blob) {
        var url = window.URL.createObjectURL(blob);
        var audio = document.createElement('audio');
        audio.src = url;
        return audio;
    };
    return Record;
}());
export { Record };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkX2F1ZGlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3JlY29yZF9hdWRpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBR3BFO0lBQ0UsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFBO0lBQ2xCLElBQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLElBQUk7UUFDZixXQUFXLEVBQUUsQ0FBQztRQUNkLFFBQVEsRUFBRSxXQUFXO0tBQ3RCLENBQUE7SUFDRCxJQUFJLFlBQVksR0FBUyxFQUFFLENBQUE7SUFFM0IsS0FBSyxDQUFDLFNBQVMsR0FBRyxVQUFDLENBQUM7UUFDbEIsUUFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNyQixLQUFLLFFBQVE7Z0JBQ1gsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ3RCLE1BQUs7WUFDUCxLQUFLLFdBQVc7Z0JBQ2QsU0FBUyxFQUFFLENBQUE7Z0JBQ1gsTUFBSztTQUNSO0lBQ0gsQ0FBQyxDQUFBO0lBRUQsb0JBQXFCLFdBQTBCO1FBQzdDLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUE7UUFFcEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNwQixZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO2FBQ3JCO1lBQ0QsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNyQztJQUNMLENBQUM7SUFFRDtRQUNFLElBQU0sYUFBYSxHQUFHLE9BQU8sRUFBRSxDQUFBO1FBQy9CLElBQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUVoRCxZQUFZLEdBQUcsRUFBRSxDQUFBO1FBRWpCLEtBQUssQ0FBQyxXQUFXLENBQUM7WUFDaEIsT0FBTyxFQUFFLFdBQVc7WUFDcEIsR0FBRyxFQUFFLFNBQVM7U0FDZixDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQseUJBQTBCLGFBQTBCO1FBQzFDLElBQUEsZ0NBQVcsRUFBRSwwQkFBUSxDQUFXO1FBQ3hDLElBQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFBO1FBRW5FLE9BQU87WUFDTCxJQUFJLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBQyxDQUFDO1lBQzVDLGNBQWM7U0FDZixDQUFBO0lBQ0gsQ0FBQztJQUVEO1FBQ0UsSUFBSSxPQUFPLEdBQU8sRUFBRSxDQUFBO1FBRXBCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDNUM7UUFFRCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7UUFDbEQsSUFBSSxNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDckMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFBO1FBQ2IsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFBO1FBR2xCLE9BQU8sS0FBSyxHQUFHLE1BQU0sRUFBRTtZQUNyQixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDeEMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQ3hDLFVBQVUsRUFBRSxDQUFBO1NBQ2I7UUFFRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUM7SUFFRCxzQkFBdUIsT0FBc0I7UUFDM0MsSUFBSSxNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDaEUsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFBO1FBRWQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFDOUIsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7U0FDNUI7UUFDRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUM7SUFFRCxtQkFBbUIsVUFBaUIsRUFBRSxXQUFrQixFQUFFLE9BQW9CO1FBQzVFLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFBO1FBQy9DLElBQU0sTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQTtRQUMvQyxJQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUVqQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ3hDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQzVCLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxVQUFVLEdBQUcsV0FBVyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUN0RCxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUM1QixXQUFXLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDcEMsZUFBZSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFFbEMsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQseUJBQXlCLE1BQWUsRUFBRSxNQUFhLEVBQUUsS0FBa0I7UUFDekUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNsRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDM0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUMvRDtJQUNILENBQUM7SUFFRCxxQkFBcUIsSUFBYSxFQUFFLE1BQWEsRUFBRSxNQUFhO1FBQzlELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDaEQ7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVEO0lBbUJFLGdCQUFvQixRQUFRLEVBQUUsU0FBUyxFQUFFLE9BQU87UUFsQnpDLFlBQU8sR0FBRyxRQUFRLENBQUE7UUFFbEIsV0FBTSxHQUFHLENBQUMsQ0FBQTtRQUdULFdBQU0sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQ3hDLGNBQVMsR0FBRyxLQUFLLENBQUE7UUFDakIsWUFBTyxHQUFHLEtBQUssQ0FBQTtRQU1mLFdBQU0sR0FBRztZQUNmLFNBQVMsRUFBRSxJQUFJO1lBQ2YsV0FBVyxFQUFFLENBQUM7U0FDZixDQUFBO1FBR0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksUUFBUSxDQUFBO1FBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxJQUFJLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQTtRQUN4QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFBO1FBQ3pDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtRQUNyQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7SUFDbEIsQ0FBQztJQUVPLCtCQUFjLEdBQXRCO1FBQUEsaUJBU0M7UUFSQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxVQUFDLENBQUM7WUFDeEIsUUFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDckIsS0FBSyxXQUFXO29CQUNkLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFDNUIsTUFBSzthQUNSO1FBQ0gsQ0FBQyxDQUFBO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQTtJQUN6QyxDQUFDO0lBRU8sNEJBQVcsR0FBbkIsVUFBcUIsRUFBMkI7WUFBMUIsaUJBQVMsRUFBRSxzQkFBYztRQUM3QyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtRQUMxQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUE7UUFDM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7UUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUE7UUFDdEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO0lBQ2xCLENBQUM7SUFFTywwQkFBUyxHQUFqQjtRQUFBLGlCQXVCQztRQXRCQyxJQUFJLENBQUMsYUFBYSxFQUFFO2FBQ25CLElBQUksQ0FBQyxVQUFBLE1BQU07WUFDRixJQUFBLHVCQUFPLENBQVM7WUFDbEIsSUFBQSxpQkFBd0MsRUFBdEMsd0JBQVMsRUFBRSw0QkFBVyxDQUFnQjtZQUM5QyxLQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFBO1lBR2xGLEtBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRXpELEtBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxHQUFHLFVBQUMsQ0FBQztnQkFDL0IsSUFBTSxNQUFNLEdBQWtCLEVBQUUsQ0FBQTtnQkFFaEMsS0FBSyxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLFdBQVcsRUFBRSxPQUFPLEVBQUUsRUFBRTtvQkFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO2lCQUNuRDtnQkFFRCxLQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztvQkFDdEIsT0FBTyxFQUFFLFFBQVE7b0JBQ2pCLEdBQUcsRUFBRSxNQUFNO2lCQUNaLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQTtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVPLDhCQUFhLEdBQXJCO1FBQ0UsT0FBTyxTQUFTLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQzthQUN4RCxJQUFJLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLEVBQU4sQ0FBTSxDQUFDO2FBQ3RCLEtBQUssQ0FBTSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDM0IsQ0FBQztJQUVNLDRCQUFXLEdBQWxCO1FBQUEsaUJBa0JDO1FBakJDLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7U0FDcEM7UUFFRCxJQUFNLE9BQU8sR0FBRztZQUNSLElBQUEsVUFBd0MsRUFBdEMsMEJBQVUsRUFBRSxzQkFBUSxFQUFFLG9CQUFPLENBQVM7WUFDNUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDZixVQUFVLENBQUMsT0FBTyxDQUFDLENBQUE7Z0JBQ25CLE9BQU07YUFDUDtZQUVELEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO1lBQ3JCLEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO1lBQ3JCLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDNUIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDekMsQ0FBQyxDQUFBO1FBQ0QsT0FBTyxFQUFFLENBQUE7SUFDWCxDQUFDO0lBRU0sMkJBQVUsR0FBakI7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7U0FDcEM7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxXQUFXO1NBQ3JCLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFTSxxQkFBSSxHQUFYO1FBQUEsaUJBaUJDO1FBaEJDLElBQUksSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO1NBQzFDO1FBRUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7UUFFbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDdEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtZQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxVQUFDLENBQUM7Z0JBQ25CLEtBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO1lBQ3RCLENBQUMsQ0FBQTtTQUNKO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRU0sc0JBQUssR0FBWjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtTQUNuQztRQUVrQixJQUFJLENBQUMsS0FBTSxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ3RDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0lBQ3RCLENBQUM7SUFFTSx5QkFBUSxHQUFmO1FBQ0UsSUFBSSxJQUFJLENBQUMsU0FBUztZQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQWtCLElBQUksQ0FBQyxTQUFTLE1BQUcsQ0FBQyxDQUFBO1FBRTdFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFBO0lBQ3pELENBQUM7SUFHRCxlQUFRLEdBRFIsVUFDVSxLQUFZLEVBQUUsS0FBYztRQUNwQyxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBR0QsbUJBQVksR0FEWixVQUNjLElBQUk7UUFDaEIsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDM0IsQ0FBQztJQUdELGVBQVEsR0FEUixVQUNVLElBQVMsRUFBRSxRQUFlO1FBQ2xDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUdELHlCQUFrQixHQURsQixVQUNvQixJQUFJO1FBQ3RCLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzVDLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDN0MsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFFZixPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQyxBQXRLRCxJQXNLQyJ9