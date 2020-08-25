var Bench = Bench || {}
Bench.charts = [
{"name":"dotty (source changes over time)","url":"https://github.com/lampepfl/dotty","lines":[{"key":"dotty","label":"bootstrapped"},{"key":"dotty-sbt","label":"with sbt phases"}]},
{"name":"scala stdlib-2.13","url":"https://github.com/dotty-staging/scala/commits/stdLib213-dotty-community-build","lines":[{"key":"stdlib213","label":"bootstrapped"}]},
{"name":"scalap","url":"https://github.com/dotty-staging/scala/commits/scalap-dotty-community-build-2.13","lines":[{"key":"scalap","label":"bootstrapped"}]},
{"name":"re2","url":"https://github.com/lampepfl/bench/blob/master/tests/re2s","lines":[{"key":"re2s","label":"bootstrapped"}]}
]
Bench.config = {"pr_base_url":"https://github.com/lampepfl/dotty/pull/"}
