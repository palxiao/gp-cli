const template = 
`
#!/usr/bin/env bash
set -e

git checkout #{depend}
git pull origin #{depend}
git checkout #{publish}

#{merge}

#{build}

git push origin #{publish}
git checkout #{develop}

echo -e "\n任务已完成\n"
exit
`

module.exports = template