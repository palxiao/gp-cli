const template_build =
`
#{build_shell}
gp-cli run -r
git add .
git commit -m 'build: #{taskName}'
`

module.exports = template_build