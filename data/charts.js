var Bench = Bench || {}

Bench.charts = [
    {
        "lines": [ { "key": "dotty", "name": "bootstrapped" } ],
        "name": "dotty (source changes over time)",
        "url": "https://github.com/lampepfl/dotty"
    },
    {
        "lines": [ { "key": "vector", "name": "bootstrapped" },
                   { "key": "vector-opt", "name": "optimised" }
                 ],
        "name": "Vector",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/Vector.scala"
    },
    {
        "lines": [ { "key": "scala-library", "name": "bootstrapped" } ],
        "name": "scala library",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/scala-library"
    },
    {
        "lines": [ { "key": "scalapb", "name": "bootstrapped" } ],
        "name": "scalapb",
        "url": "https://github.com/liufengyun/ScalaPB/"
    },
    {
        "lines": [ { "key": "scalap", "name": "bootstrapped" } ],
        "name": "scalap",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/scalap"
    },
    {
        "lines": [ { "key": "re2s", "name": "bootstrapped" } ],
        "name": "re2",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/re2s"
    },
    {
        "lines": [
            { "key": "implicit-cache", "name": "bootstrapped" }
        ],
        "name": "implicit cache I",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/implicit_cache.scala"
    },
    {
        "lines": [
            { "key": "implicitNums", "name": "bootstrapped" }
        ],
        "name": "implicit cache II",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/implicitNums.scala"
    },
    {
        "lines": [ { "key": "implicit-scope-loop", "name": "bootstrapped" } ],
        "name": "implicit scope loop",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/implicit-scope-loop.scala"
    },
    {
        "lines": [ { "key": "patmatexhaust", "name": "bootstrapped" } ],
        "name": "exhaustivity check",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/patmatexhaust.scala"
    },
    {
        "lines": [ { "key": "exhaustivity-I", "name": "bootstrapped" } ],
        "name": "exhaustivity I",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/exhaustivity-I.scala"
    },
    {
        "lines": [ { "key": "exhaustivity-S", "name": "bootstrapped" } ],
        "name": "exhaustivity S",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/exhaustivity-S.scala"
    },
    {
        "lines": [ { "key": "exhaustivity-T", "name": "bootstrapped" } ],
        "name": "exhaustivity T",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/exhaustivity-T.scala"
    },
    {
        "lines": [ { "key": "exhaustivity-V", "name": "bootstrapped" } ],
        "name": "exhaustivity V",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/exhaustivity-V.scala"
    },
    {
        "lines": [ { "key": "i1535", "name": "bootstrapped" } ],
        "name": "issue #1535",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/i1535.scala"
    },
    {
        "lines": [ { "key": "i1687", "name": "bootstrapped" } ],
        "name": "issue #1687",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/i1687.scala"
    },
    {
        "lines": [ { "key": "empty-class", "name": "bootstrapped" } ],
        "name": "empty class",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/empty-class.scala"
    },
    {
        "lines": [ { "key": "empty-object", "name": "bootstrapped" } ],
        "name": "empty object",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/empty-object.scala"
    },
    {
        "lines": [ { "key": "empty-file", "name": "bootstrapped" } ],
        "name": "empty file",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/empty-file.scala"
    },
    {
        "lines": [ { "key": "power-macro-power-inlined-1", "name": "bootstrapped" } ],
        "name": "Inline a quote",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/power-macro/PowerInlined-1.scala"
    },
    {
        "lines": [ { "key": "power-macro-power-inlined-1k", "name": "bootstrapped" } ],
        "name": "Inline 1k quotes",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/power-macro/PowerInlined-1k.scala"
    }
]

Bench.pr_base_url = "https://github.com/lampepfl/dotty/pull/"
