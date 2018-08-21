const COS = require('cos-nodejs-sdk-v5');
const path = require('path')
const fs = require('fs')
var chalk = require('chalk')

module.exports = (source)=>{
    const config = require('../config')
    const pathName = path.join(process.cwd(),source);
    if(!fs.existsSync(pathName)){
        console.log('error : '+pathName + '不存在')
        process.exitCode = 1
        return
    }
    for (let item in config){
        if(!config[item]){
            console.error(`请配置 ${item} ..`)
            process.exitCode = 1
            return
        }
    }
    const {SecretId, SecretKey,Bucket,Region,Key} = config;
    const cos = new COS({SecretId: SecretId, SecretKey: SecretKey});
    //查看当前路径
    fs.stat(pathName,(err,stat)=>{
        if (err) {
            console.error(err);
            process.exitCode = 1
            return false
        }
        if(stat.isFile()){
            _pushFile(Key+'/'+path.basename(pathName),pathName);
        }
        else if(stat.isDirectory()){
            _pushDir(Key+'/'+source,pathName);

        }
    })
    function _pushDir(target,pathDir) {
        var files = fs.readdirSync(pathDir)
        if (files && files.length > 0) {
            files.forEach(function(file) {
                let stat = fs.statSync(path.join(pathDir,file))
                if(stat.isFile()) _pushFile(target+'/'+file,path.join(pathDir,file));
                else if(stat.isDirectory()) _pushDir(target+'/'+file,path.join(pathDir,file))
            });
        }
    }
    function _pushFile(key,file) {
        var params = {
            Bucket : Bucket,                        /* 必须 */
            Region : Region,                        /* 必须 */
            Key : key,                            /* 必须 */
            FilePath: file,           /* 必须 */
            onHashProgress: function (progressData) {
                // console.log(JSON.stringify(progressData));
            },
            onProgress: function (progressData) {
                // console.log(JSON.stringify(progressData));
            },
        };
        cos.sliceUploadFile(params, function(err, data) {
            if(err) {
                console.log(err);
            } else {
                console.log(chalk.yellow(data.Key),chalk.blue(data.Location));
                // console.log(data.Key);
            }
        });
    }
}

