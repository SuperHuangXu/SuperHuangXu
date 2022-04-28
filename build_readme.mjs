import fs from 'node:fs/promises'
import { format } from 'node:util'
import request from 'superagent'
import rssToJson from 'rss-to-json'
const { Parse } = rssToJson

async function main() {
  const readmePath = './README.md'
  const doubanMd = await fetchDouban()
  const codeTimeMd = await fetchCodeTime()
  console.log(process.env);
  const md = format(
    `
### Hi 👋

**以下内容通过 <a href="https://github.com/SuperHuangXu/SuperHuangXu/actions" target="_blank">SuperHuangXu/actions</a> 每日自动更新**；

<table width="800px">
<tr>
<td valign="top" width="50%">

#### 🏊‍♂️ <a href="https://gist.github.com/SuperHuangXu/d3e32e70ad1d22b5a3c5e8fc3c67dcc5" target="_blank">Weekly Development Breakdown</a>

%s

</td>
<td valign="top" width="50%">
<a href="https://github.com/SuperHuangXu">
  <img align="center" src="https://github-readme-stats.vercel.app/api/top-langs/?username=SuperHuangXu&layout=compact&theme=radical" />
</a>
</td>
</tr>
<tr>
<td valign="top" width="50%">

#### 🤾‍♂️ <a href="https://www.douban.com/people/135404786/" target="_blank">Funny Soul</a>

%s

</td>
</tr>
</table>
`,
    codeTimeMd,
    doubanMd
  )
  console.log(md)
  await fs.writeFile(readmePath, md)
}

async function fetchDouban() {
  const url = 'https://www.douban.com/feed/people/135404786/interests'
  const res = await Parse(url)
  const arr = res.items.slice(0, 5)
  return arr
    .map(
      (item) =>
        `* <a href='${item.link}' target='_blank'>${
          item.title
        }</a> - ${new Date(item.published).toLocaleDateString()}`
    )
    .join('\n')
}

async function fetchCodeTime() {
  const url =
    'https://gist.githubusercontent.com/SuperHuangXu/d3e32e70ad1d22b5a3c5e8fc3c67dcc5/raw'
  const res = await request.get(url)
  return '```text\n' + res.text + '\n```'
}

main()
