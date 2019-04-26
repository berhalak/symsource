# symsource

npm i -g symsource

Share source code between projects

This tool helps sharing source code in monorepo.

Having structure like:

```
-root
|_ libs
   |_ domain
   |_ shared
   |_ infra
|_ web
  |_ src
|_ server
  |_ src
```

It will create symlinks in web/src and server/src to libs folder
```
-root
|_ libs
   |_ domain
   |_ shared
   |_ infra
|_ web
  |_ src
    |_libs
      |_domain <symlink>  to ../../../libs/shared
      |_shared <symlink>  to ../../../libs/shared
|_ server
  |_ src
```
Usage:
Add to package.json of any root project

```
...
"libs" : ["domain", "shared"],
```

And invoke 
symsource in root level of monorepo


