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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV91dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9ub2RlX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUVyRCxxQkFBc0IsVUFBaUI7SUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ3hDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsaUJBQWUsVUFBVSx1REFBZ0QsRUFBRSxJQUFJLENBQUMsQ0FBQTtLQUN6RztBQUNILENBQUM7QUFFRCxNQUFNLHFCQUFzQixRQUFlLEVBQUUsTUFBYSxFQUFFLGFBQXNCO0lBQ2hGLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUV6QixPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsUUFBaUI7UUFDbkMsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3hCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUE7UUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBRWYsaUJBQWtCLGNBQXFCLEVBQUUsWUFBbUI7WUFDMUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQ2hDLEVBQUUsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUE7YUFDM0I7WUFFRCxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLO2dCQUNwQyxJQUFJLEdBQUc7b0JBQUUsTUFBTSxHQUFHLENBQUE7d0NBRVAsSUFBSTtvQkFDYixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFBO29CQUM3QyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxF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