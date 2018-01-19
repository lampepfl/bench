var Bench = Bench || {}

Bench.charts = [
    {
        "key": "dotty",
        "name": "dotty (source changes over time)",
        "url": "https://github.com/lampepfl/dotty"
    },
    {
        "key": "tests/Vector.scala",
        "name": "Vector",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/Vector.scala"
    },
    {
        "key": "opts/Vector.scala",
        "name": "Vector (optimised)",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/Vector.scala"
    },
    {
        "key": "tests/scala-library",
        "name": "scala library",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/scala-library"
    },
    {
        "key": "opts/scala-library",
        "name": "scala library (optimised)",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/scala-library"
    },
    {
        "key": "tests/scalapb",
        "name": "scalapb",
        "url": "https://github.com/liufengyun/ScalaPB/"
    },
    {
        "key": "opts/scalapb",
        "name": "scalapb (optimised)",
        "url": "https://github.com/liufengyun/ScalaPB/"
    },
    {
        "key": "tests/implicit_cache.scala",
        "name": "implicit cache I",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/implicit_cache.scala"
    },
    {
        "key": "tests/implicitNums.scala",
        "name": "implicit cache II",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/implicitNums.scala"
    },
    {
        "key": "tests/implicit-scope-loop.scala",
        "name": "implicit scope loop",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/implicit-scope-loop.scala"
    },
    {
        "key": "tests/patmatexhaust.scala",
        "name": "exhaustivity check",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/patmatexhaust.scala"
    },
    {
        "key": "tests/exhaustivity-I.scala",
        "name": "exhaustivity I",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/exhaustivity-I.scala"
    },
    {
        "key": "tests/exhaustivity-S.scala",
        "name": "exhaustivity S",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/exhaustivity-S.scala"
    },
    {
        "key": "tests/exhaustivity-T.scala",
        "name": "exhaustivity T",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/exhaustivity-T.scala"
    },
    {
        "key": "tests/exhaustivity-V.scala",
        "name": "exhaustivity V",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/exhaustivity-V.scala"
    },
    {
        "key": "tests/i1535.scala",
        "name": "issue #1535",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/i1535.scala"
    },
    {
        "key": "tests/i1687.scala",
        "name": "issue #1687",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/i1687.scala"
    },
    {
        "key": "tests/empty-class.scala",
        "name": "empty class",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/empty-class.scala"
    },
    {
        "key": "tests/empty-object.scala",
        "name": "empty object",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/empty-object.scala"
    },
    {
        "key": "tests/empty-file.scala",
        "name": "empty file",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/empty-file.scala"
    },
    {
        "key": "tests/power-macro/PowerInlined-1.scala",
        "name": "Inline a quote",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/power-macro/PowerInlined-1.scala"
    },
    {
        "key": "tests/power-macro/PowerInlined-1k.scala",
        "name": "Inline 1k quotes",
        "url": "https://github.com/liufengyun/bench/blob/master/tests/power-macro/PowerInlined-1k.scala"
    }
]

Bench.pr_base_url = "https://github.com/lampepfl/dotty/pull/"
