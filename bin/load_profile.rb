require 'yaml'

def load_profile(file, data = {})
  puts "loading #{file}"
  sub_data = YAML.load_file(file)

  # include file
  includes = sub_data["includes"] || []
  includes.each do |path|
    path = File.expand_path(path, File.dirname(file)) # expand relative path
    data = load_profile(path, data)
  end

  # init
  data["config"] ||= {}
  data["charts"] ||= []
  data["scripts"] ||= {}

  # check meta-propertis
  (sub_data["config"] || {}).each do |key, value|
    current = data["config"][key]
    if current == nil
      data["config"][key] = value
    elsif current != value
      raise "incompatible key: current = #{current}, found = #{value}, file #{file}"
    end
  end

  lines = {}

  # check lines
  (sub_data["charts"] || []).each do |chart|
    raise "lines cannot be empty, chart = #{chart["name"]}, file = #{file}" unless chart["lines"] && chart["lines"].size > 0

    chart["lines"].each do |line|
      raise "key = #{key} already included, file = #{file}" if lines[line["key"]]
      lines[line["key"]] = true
    end

    data["charts"] << chart
  end

  # check no conflict in keys
  (sub_data["scripts"] || {}).each do |key, value|
    raise "key = #{key} already included, file = #{file}" if data["scripts"][key]
    lines.delete(key)
    data["scripts"][key] = value
  end

  # check that scripts are defined for declared lines
  lines.each do |key, value|
    raise "scripts not defined for #{key}, file = #{file}" if data["scripts"][key]
  end

  data
end
