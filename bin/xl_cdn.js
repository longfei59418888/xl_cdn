#!/usr/bin/env node

var path = require('path');
var argv = require('yargs').argv
var program = require('commander')
var shell = require('shelljs')
var config = require('../lib/config.js')
var upload = require('../lib/upload.js')
// 如果存在本地的命令，执行本地的
try {
    var localWebpack = require.resolve(path.join(process.cwd(), "node_modules", "xl_cdn", "bin", "xl_cdn.js"));
    if (__filename !== localWebpack) {
        return require(localWebpack);
    }
} catch (e) {
}


let package = JSON.parse(shell.cat(path.join(__dirname, '../package.json')))

program
    .version(package.version)
    .usage('[cmd] [options]')
    .option('--SecretId', '设置 cdn 的 SecretId 值')
    .option('--SecretKey', '设置 cdn 的 SecretKey 值')
    .option('--Bucket', '设置 cdn 的 Bucket 值')
    .option('--Region', '设置 cdn 的 Region 值')
    .option('--Key', '设置 cdn 的 Key 值')
program
    .command('upload <path>')
    .description('上传某一个目录到 cdn ')
    .action((path, options) => {
        upload(path)
    })
program
    .command('config')
    .option('--SecretId', '设置 cdn 的 SecretId 值')
    .option('--SecretKey', '设置 cdn 的 SecretKey 值')
    .option('--Bucket', '设置 cdn 的 Bucket 值')
    .option('--Region', '设置 cdn 的 Region 值')
    .option('--Key', '设置 cdn 的 Key 值')
    .description('上传某一个目录到 cdn ')
    .action((option, options) => {
        config(argv,options)
    })
program.parse(process.argv)


