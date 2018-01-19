module.exports = (fileInfo, api, options) => {
  const j = api.jscodeshift
  return j(fileInfo.source)
    .find(api.jscodeshift.VariableDeclaration)
    .forEach(path => {
      if (
        path.get('declarations').value.length > 1 &&
        path.parent.get('type').value !== 'ForStatement'
      ) {
        path.insertAfter(
          ...path
            .get('declarations')
            .value.map(({ id, init }) =>
              j.variableDeclaration(path.get('kind').value, [
                j.variableDeclarator(id, init)
              ])
            )
        )
        path.prune()
      }
    })
    .toSource()
}
