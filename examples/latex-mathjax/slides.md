class: center, middle
# Configuring remarker to display LaTeX via MathJax

Michael Liebling

26 September 2019

This is an example remark presentation that demonstrates the use of math and the corresponding remarker configuration.


---

# LaTeX, Mathjax, & Remark

The use of MathJax with Remark is documented on a [Remark wiki page](https://github.com/gnab/remark/wiki/LaTeX-using-MathJax). Specifically, the syntax requires that LaTeX math commands be placed between a pair of backticks:

```markdown
`\(\LaTeX{}\)`

1. This is an inline integral: `\(\int_a^bf(x)dx\)`
2. More `\(x={a \over b}\)` formulae.
 
Display formula:

$$e^{i\pi} + 1 = 0$$
```

*Note:*
 this is different from the syntax used in [marked2app](https://marked2app.com/help/MathJax.html),  where LaTeX math is indicated with an extra backslash:

```markdown
\\(  x^2+y^2 \\)
```


---

# LaTeX and Mathjax with Remarker

In order for the presentation to be properly generated, one creates a `remarker.yml` configuration file (at the same level as the `slides.md` file) with the following content:
 
```YML
scriptFiles:
    - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML&delayStartupUntil=configured
script:
  - "MathJax.Hub.Config({ tex2jax: { skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'] } }); MathJax.Hub.Configured();"
```

---

# Math example

`\(\LaTeX{}\)`

1. This is an inline integral: `\(\int_a^bf(x)dx\)`
2. More `\(x={a \over b}\)` formulae.
 
Display formula:

$$e^{i\pi} + 1 = 0$$

