# RDF-Package in CSS

See the package.json. I put in a separate compilation for the N3 github dependency (a branch with N3 parsing).
Probably this is something I need to fix in the rdf-package lib itself? 


```bash
yarn install;
yarn run build;
yarn run start:seeded
```

Get resource with rdf-package content type
```bash
curl localhost:3000/alice/profile/card#me -H "Accept: text/n3-package"

```