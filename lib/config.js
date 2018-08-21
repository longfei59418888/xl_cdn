var path = require('path');
var shell = require('shelljs')
    var chalk = require('chalk')
var fs = require('fs')

let config = JSON.parse(shell.cat(path.join(__dirname, '../config.json')))
module.exports = (argv)=>{
    for (let item in  config){
        if(argv[item]) config[item] = argv[item]
        console.log(chalk.yellow(`${item}:`)+chalk.red(`${config[item]}`))
    }
    fs.writeFile(path.join(__dirname,'../config.json'), JSON.stringify(config), 'utf8', (err, data)=>{
        if (err) {
            console.error(path+' is not fond');
            process.exitCode = 1;
            return;
        }
        console.log(chalk.blue('配置成功！'))
        process.exitCode = 1;
    });
}