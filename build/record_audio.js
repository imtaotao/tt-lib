import { AudioCtx, download, inlineWorker, logError } from './utils';
function workerBody() {
    var _self = this;
    var config = {
        bufferLen: 4096,
        numChannels: 2,
        mime_type: 'audio/wav',
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
        var numChannels = config.numChannels, mime_type = config.mime_type;
        var interleaveData = encodeWAV(44100, numChannels, collectRecord);
        return [
            new Blob([interleaveData], { type: mime_type }),
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
        this.errorFn = Record.logError;
        this.worker = Record.inlineWorker(workerBody);
        this.recording = false;
        this.playing = false;
        this.config = {
            bufferLen: 4096,
            numChannels: 2,
        };
        this.filename = filename || 'record';
        this.successFn = successFn || (function () { });
        this.errorFn = errorFn;
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
            this.audio = Record.createAudioEl(this.audioBlob);
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
    Record.createAudioEl = function (blob) {
        var url = window.URL.createObjectURL(blob);
        var audio = document.createElement('audio');
        audio.src = url;
        return audio;
    };
    return Record;
}());
export { Record };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkX2F1ZGlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3JlY29yZF9hdWRpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBR3BFO0lBQ0UsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFBO0lBQ2xCLElBQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLElBQUk7UUFDZixXQUFXLEVBQUUsQ0FBQztRQUNkLFNBQVMsRUFBRSxXQUFXO0tBQ3ZCLENBQUE7SUFDRCxJQUFJLFlBQVksR0FBUyxFQUFFLENBQUE7SUFFM0IsS0FBSyxDQUFDLFNBQVMsR0FBRyxVQUFDLENBQUM7UUFDbEIsTUFBTSxDQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLEtBQUssUUFBUTtnQkFDWCxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDdEIsS0FBSyxDQUFBO1lBQ1AsS0FBSyxXQUFXO2dCQUNkLFNBQVMsRUFBRSxDQUFBO2dCQUNYLEtBQUssQ0FBQTtRQUNULENBQUM7SUFDSCxDQUFDLENBQUE7SUFFRCxvQkFBcUIsV0FBMEI7UUFDN0MsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQTtRQUVwQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtZQUN0QixDQUFDO1lBQ0QsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxX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