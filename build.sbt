scalaVersion := "0.4.0-bin-SNAPSHOT"

// avoid incident errors in testing
parallelExecution := false

packSettings
enablePlugins(JmhPlugin)

libraryDependencies ++= Seq(
  // ("me.d-d" % "scala-compiler" % "2.11.5-20170111-125332-40bdc7b65a").withDottyCompat(),
  // ("org.scala-lang" % "scala-reflect" % "2.11.11").withDottyCompat(), // old version of dotty depends on it
  "ch.epfl.lamp" %% "dotty" % "0.4.0-bin-SNAPSHOT"
)

mainClass in (Jmh, run) := Some("dotty.tools.benchmarks.Bench")  // custom main for jmh:run

publishArtifact := false

packMain := Map("bench" -> "dotty.tools.benchmarks.Bench")

packGenerateWindowsBatFile := false

packExpandedClasspath := false  // important, check the template and bin/replace for details

packBashTemplate := baseDirectory.value + "/templates/launch.mustache"

