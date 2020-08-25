var Bench = Bench || {}
Bench.charts = [
{"name":"dotty (source changes over time)","url":"https://github.com/lampepfl/dotty","lines":[{"key":"dotty","label":"bootstrapped"},{"key":"dotty-sbt","label":"with sbt phases"}]},
{"name":"scala stdlib-2.13","url":"https://github.com/dotty-staging/scala/commits/stdLib213-dotty-community-build","lines":[{"key":"stdlib213","label":"bootstrapped"}]},
{"name":"scalap","url":"https://github.com/dotty-staging/scala/commits/scalap-dotty-community-build-2.13","lines":[{"key":"scalap","label":"bootstrapped"}]},
{"name":"re2","url":"https://github.com/lampepfl/bench/blob/master/tests/re2s","lines":[{"key":"re2s","label":"bootstrapped"}]},
{"name":"Inline a quote","url":"https://github.com/lampepfl/dotty/blob/master/tests/bench/power-macro/PowerInlined-1.scala","lines":[{"key":"power-macro-power-inlined-1","label":"bootstrapped"}]},
{"name":"Inline 1k quotes","url":"https://github.com/lampepfl/dotty/blob/master/tests/bench/power-macro/PowerInlined-1k.scala","lines":[{"key":"power-macro-power-inlined-1k","label":"bootstrapped"}]},
{"name":"issue #1535","url":"https://github.com/lampepfl/dotty/blob/master/tests/bench/i1535.scala","lines":[{"key":"i1535","label":"bootstrapped"}]},
{"name":"issue #1687","url":"https://github.com/lampepfl/dotty/blob/master/tests/bench/i1687.scala","lines":[{"key":"i1687","label":"bootstrapped"}]},
{"name":"empty class","url":"https://github.com/lampepfl/dotty/blob/master/tests/bench/empty-class.scala","lines":[{"key":"empty-class","label":"bootstrapped"}]},
{"name":"empty object","url":"https://github.com/lampepfl/dotty/blob/master/tests/bench/empty-object.scala","lines":[{"key":"empty-object","label":"bootstrapped"}]},
{"name":"empty file","url":"https://github.com/lampepfl/dotty/blob/master/tests/bench/empty-file.scala","lines":[{"key":"empty-file","label":"bootstrapped"}]}
]
Bench.config = {"pr_base_url":"https://github.com/lampepfl/dotty/pull/"}
