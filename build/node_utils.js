import { platform, logError } from './utils';
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
                    console.log(stats.size, size);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV91dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9ub2RlX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBRTVDLHFCQUFzQixVQUFpQjtJQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN6QyxRQUFRLENBQUMsYUFBYSxFQUFFLGlCQUFlLFVBQVUsdURBQWdELEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDMUcsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLHFCQUFzQixRQUFlLEVBQUUsTUFBYSxFQUFFLGFBQXNCO0lBQ2hGLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUV6QixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBQyxRQUFpQjtRQUNuQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDeEIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQTtRQUNqQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUE7UUFFZixpQkFBa0IsY0FBcUIsRUFBRSxZQUFtQjtZQUMxRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxFQUFFLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQzVCLENBQUM7WUFFRCxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLO2dCQUNwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7b0JBQUMsTUFBTSxHQUFHLENBQUE7d0NBRVAsSUFBSTtvQkFDYixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FB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