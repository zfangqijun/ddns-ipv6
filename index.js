import { publicIp, publicIpv4, publicIpv6 } from 'public-ip';
import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = JSON.parse(
    await readFile(path.resolve(__dirname, './config.local.json'))
);



const curlRecordModify = `curl --location --request POST 'https://dnsapi.cn/Record.Modify'`;
const curlRecordList = `curl --location --request POST 'https://dnsapi.cn/Record.List'`;

(async function main() {
    console.log('\n[start]');

    const ip = await publicIpv6();

    console.log('\t[ipv6]', ip);

    const recordArgs = await fetchRecord();

    const args = { ...config, ...recordArgs, value: ip }

    const cmdArgs = Object.keys(args).map(key => `--form '${key}="${args[key]}"'`);

    const cmd = [curlRecordModify, ...cmdArgs].join(' ')

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(error)
        }

        const { status } = JSON.parse(stdout);

        if (status?.code === '1') {
            console.log('\t[updated]', JSON.stringify(status))
        } else {
            console.error('\t[fail]', stdout, stderr)
        }
    })
})();

async function fetchRecord() {
    return new Promise((resolve, reject) => {
        const args = { ...config }
        const cmdArgs = Object.keys(args).map(key => `--form '${key}="${args[key]}"'`);
        const cmd = [curlRecordList, ...cmdArgs].join(' ')

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(error)
            }

            const { status, records } = JSON.parse(stdout);

            if (status?.code === '1') {
                const { id, line_id, type } = records[0];

                console.log('\t[fetch record]', JSON.stringify({ id, line_id, type }))

                resolve({
                    record_id: id,
                    record_line_id: line_id,
                    record_type: type
                })
            } else {
                console.error('\t[fetch record fail]', stdout)
                reject()
            }
        })
    })
}

