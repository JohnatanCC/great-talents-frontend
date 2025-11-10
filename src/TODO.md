## ✅ RESOLVIDO - Auth/login

~~Na parte de esqueci minha senha colocar loading no botão de enviar e impedir desabilitar botões durante a requisição.~~
✅ Adicionado estado de loading com `isLoading`, botões desabilitados durante requisição e feedback visual.

# ✅ RESOLVIDO - Console erros e alerts

~~Alert:~~ 
~~index.tsx:13 motion() is deprecated. Use motion.create() instead.~~
✅ Atualizado para usar `motion.create` quando disponível com fallback para `motion()`.

~~erro:~~
~~chunk-YQ5BCTVV.js?v=2b7c28db:521 Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.~~
✅ Substituído tags HTML `<b>` por componentes Chakra `<Text as="span" fontWeight="bold">` para evitar nesting inválido.

**Nota:** Os erros de postMessage do YouTube são externos (API do YouTube tentando comunicar com localhost) e não afetam a funcionalidade.

# ✅ RESOLVIDO - DOM nesting em Resume

~~Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p> em InfoRow~~
✅ Corrigido componente `InfoRow` na tela Resume para usar `<Box>` ao invés de `<Text>` para o valor, evitando componentes `<Skeleton>` e fragmentos `<>` dentro de elementos `<p>`.

## Candidate/EditResume

Na criação de habilidades a nomeclatura "Fluente" não é adaqueada já que isso é para idiomas.
Em  idiomas os nomes dos niveis estão em inglês.

## Canidate/OpportunitiesView

Padronizar estilos de tela e adicionar espaçamentos internto no card principal.

## Padronizar estilos para usar os tokesn criados