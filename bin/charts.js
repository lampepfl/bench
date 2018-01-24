var Bench = Bench || {}

Bench.charts = [
    {
        "lines": [ { "key": "dotty", "name": "bootstrapped" } ],
        "name": "dotty (source changes over time)",
        "url": "https://github.com/lampepfl/dotty"
    },
    {
        "lines": [ { "key": "tests/Vector.scala", "name": "bootstrapped" },
                   { "key": "opts/Vector.scala", "name": "optimised" }
                 ],
        "name": "Vector",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/Vector.scala"
    },
    {
        "lines": [ { "key": "tests/scala-library", "name": "bootstrapped" }, { "key": "opts/scala-library", "name": "optimised" } ],
        "name": "scala library",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/scala-library"
    },
    {
        "lines": [ { "key": "tests/scalapb", "name": "bootstrapped" }, { "key": "opts/scalapb", "name": "optimised" } ],
        "name": "scalapb",
        "url": "https://github.com/liufengyun/ScalaPB/"
    },
    {
        "lines": [
            { "key": "tests/implicit_cache.scala", "name": "bootstrapped" },
            { "key": "from-tasty/implicit_cache.scala", "name": "from-tasty" }
        ],
        "name": "implicit cache I",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/implicit_cache.scala"
    },
    {
        "lines": [
            { "key": "tests/implicitNums.scala", "name": "bootstrapped" },
            { "key": "from-tasty/implicitNums.scala", "name": "from-tasty" }
        ],
        "name": "implicit cache II",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/implicitNums.scala"
    },
    {
        "lines": [ { "key": "tests/implicit-scope-loop.scala", "name": "bootstrapped" } ],
        "name": "implicit scope loop",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/implicit-scope-loop.scala"
    },
    {
        "lines": [ { "key": "tests/patmatexhaust.scala", "name": "bootstrapped" } ],
        "name": "exhaustivity check",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/patmatexhaust.scala"
    },
    {
        "lines": [ { "key": "tests/exhaustivity-I.scala", "name": "bootstrapped" } ],
        "name": "exhaustivity I",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/exhaustivity-I.scala"
    },
    {
        "lines": [ { "key": "tests/exhaustivity-S.scala", "name": "bootstrapped" } ],
        "name": "exhaustivity S",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/exhaustivity-S.scala"
    },
    {
        "lines": [ { "key": "tests/exhaustivity-T.scala", "name": "bootstrapped" } ],
        "name": "exhaustivity T",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/exhaustivity-T.scala"
    },
    {
        "lines": [ { "key": "tests/exhaustivity-V.scala", "name": "bootstrapped" } ],
        "name": "exhaustivity V",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/exhaustivity-V.scala"
    },
    {
        "lines": [ { "key": "tests/i1535.scala", "name": "bootstrapped" } ],
        "name": "issue #1535",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/i1535.scala"
    },
    {
        "lines": [ { "key": "tests/i1687.scala", "name": "bootstrapped" } ],
        "name": "issue #1687",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/i1687.scala"
    },
    {
        "lines": [ { "key": "tests/empty-class.scala", "name": "bootstrapped" } ],
        "name": "empty class",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/empty-class.scala"
    },
    {
        "lines": [ { "key": "tests/empty-object.scala", "name": "bootstrapped" } ],
        "name": "empty object",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/empty-object.scala"
    },
    {
        "lines": [ { "key": "tests/empty-file.scala", "name": "bootstrapped" } ],
        "name": "empty file",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/empty-file.scala"
    },
    {
        "lines": [ { "key": "tests/power-macro/PowerInlined-1.scala", "name": "bootstrapped" } ],
        "name": "Inline a quote",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/power-macro/PowerInlined-1.scala"
    },
    {
        "lines": [ { "key": "tests/power-macro/PowerInlined-1k.scala", "name": "bootstrapped" } ],
        "name": "Inline 1k quotes",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/power-macro/PowerInlined-1k.scala"
    },
    {
        "lines": [ { "key": "tests/re2s", "name": "bootstrapped" }, { "key": "opts/re2s", "name": "optimised" } ],
        "name": "re2",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/re2s"
    }
]

Bench.pr_base_url = "https://github.com/lampepfl/dotty/pull/"