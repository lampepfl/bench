var Bench = Bench || {}
Bench.charts = [
{"name":"implicit cache I","url":"https://github.com/lampepfl/dotty/blob/master/tests/bench/implicit_cache.scala","lines":[{"key":"implicit-cache","label":"bootstrapped"},{"key":"implicit-cache-from-tasty","label":"from tasty"}]},
{"name":"implicit cache II","url":"https://github.com/lampepfl/dotty/blob/master/tests/bench/implicitNums.scala","lines":[{"key":"implicitNums","label":"bootstrapped"},{"key":"implicitNums-from-tasty","label":"from tasty"}]},
{"name":"implicit scope loop","url":"https://github.com/lampepfl/dotty/blob/master/tests/bench/implicit-scope-loop.scala","lines":[{"key":"implicit-scope-loop","label":"bootstrapped"}]},
{"name":"inductive implicits","url":"https://github.com/lampepfl/dotty/blob/master/tests/bench/inductive-implicits.scala","lines":[{"key":"inductive-implicits","label":"bootstrapped"}]}
]
Bench.config = {"pr_base_url":"https://github.com/lampepfl/dotty/pull/"}
