import { platform, logError, require } from './utils';
function envJudgment(methodName) {
    if (!platform.node && !platform.electron) {
        logError('Environment', "[ NodeUtils." + methodName + " ] method Must be used in \"node\" or \"electron\"", true);
    }
}
export function copyForder(fromPath, toPath, needCompolete) {
    envJudgment('copyForder');
    return new Promise(function (_resolve) {
        var fs = require('fs');
        var join = require('path').join;
        var size = null;
        function copyDir(singleFromPath, singleToPath) {
            if (!fs.existsSync(singleToPath)) {
                fs.mkdirSync(singleToPath);
            }
            fs.readdir(singleFromPath, function (err, files) {
                if (err)
                    throw err;
                var _loop_1 = function (file) {
                    var currentUrl = join(singleFromPath, file);
                    var toUrl = join(singleToPath, file);
                    fs.stat(currentUrl, function (err, stats) {
                        if (err)
                            throw err;
                        stats.isFile()
                            ? copyFile(currentUrl, toUrl)
                            : copyDir(currentUrl, toUrl);
                    });
                };
                for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                    var file = files_1[_i];
                    _loop_1(file);
                }
            });
        }
        function copyFile(input, output) {
            fs.createReadStream(input).pipe(fs.createWriteStream(output));
        }
        function copyCompolete() {
            process.nextTick(function () {
                if (!fs.existsSync(toPath)) {
                    return copyCompolete();
                }
                fs.stat(toPath, function (err, stats) {
                    if (err)
                        throw err;
                    stats.size === size
                        ? _resolve()
                        : copyCompolete();
                });
            });
        }
        if (!needCompolete)
            return _resolve();
        fs.stat(fromPath, function (err, stats) {
            if (err)
                throw err;
            size = stats.size;
            copyDir(fromPath, toPath);
            copyCompolete();
        });
    });
}
export function deleteForder(path, needCompolete) {
    envJudgment('deleteForder');
    return new Promise(function (_resolve) {
        var fs = require('fs');
        var resolve = require('path').resolve;
        if (!fs.existsSync(path))
            return _resolve();
        function insertDeleteForder(_path) {
            if (fs.existsSync(_path)) {
                var files = fs.readdirSync(_path);
                for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
                    var file = files_2[_i];
                    var curPath = resolve(_path, file);
                    fs.statSync(curPath).isDirectory()
                        ? insertDeleteForder(curPath)
                        : fs.unlinkSync(curPath);
                }
                fs.rmdirSync(_path);
            }
        }
        function isDeleteCompolete() {
            process.nextTick(function () {
                fs.exists(path, function (exists) {
                    exists
                        ? isDeleteCompolete()
                        : _resolve();
                });
            });
        }
        insertDeleteForder(path);
        needCompolete
            ? isDeleteCompolete()
            : _resolve();
    });
}
export function transferFile(from, to) {
    envJudgment('transferFile');
    return new Promise(function (_resolve) {
        var fs = require('fs');
        var read_stream = fs.createReadStream(from);
        var write_stream = fs.createWriteStream(to);
        read_stream.pipe(write_stream);
        read_stream.on('end', function (err) {
            if (err)
                throw err;
            _resolve();
        });
    });
}
export function getIp(family) {
    if (family === void 0) { family = 'IPv4'; }
    envJudgment('getIp');
    var interfaces = require('os').networkInterfaces();
    return Object.keys(interfaces).reduce(function (arr, x) {
        var interfce = interfaces[x];
        return arr.concat(Object.keys(interfce)
            .filter(function (x) { return interfce[x].family === family && !interfce[x].internal; })
            .map(function (x) { return interfce[x].address; }));
    }, []);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV91dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9ub2RlX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUVyRCxxQkFBc0IsVUFBaUI7SUFDckMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDekMsUUFBUSxDQUFDLGFBQWEsRUFBRSxpQkFBZSxVQUFVLHVEQUFnRCxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQzFHLENBQUM7QUFDSCxDQUFDO0FBRUQsTUFBTSxxQkFBc0IsUUFBZSxFQUFFLE1BQWEsRUFBRSxhQUFzQjtJQUNoRixXQUFXLENBQUMsWUFBWSxDQUFDLENBQUE7SUFFekIsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLFVBQUMsUUFBaUI7UUFDbkMsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3hCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUE7UUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBRWYsaUJBQWtCLGNBQXFCLEVBQUUsWUFBbUI7WUFDMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUM1QixDQUFDO1lBRUQsRUFBRSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsVUFBQyxHQUFHLEVBQUUsS0FBSztnQkFDcEMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDO29CQUFDLE1BQU0sR0FBRyxDQUFBO3dDQUVQLElBQUk7b0JBQ2IsSUFBTSxVQUFVLEdBQUcsSUFB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