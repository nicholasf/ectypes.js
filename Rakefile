#!/usr/bin/env rake
require 'fileutils'
include FileUtils

namespace :browser do
	DEST = "drafts-browser.js"
	src_files = ['drafts.js'] #ensure that drafts.js is first
	src_directories = ['lib/strategies']

	task :create do
		output = "//built on #{Time.now}\n"
		for src_file in src_files
			output += extract(/@BROWSER\-begins/, /@BROWSER\-ends/, src_file)
		end

		output = output.gsub("exports[mapping] = drafts[mapping]; //remove this in browser build", "")
		
		for dir in src_directories
			current_dir = Dir.pwd

			Dir.chdir dir
			Dir.glob('*.js').each do |src_file|
				fragment = extract(/@BROWSER\-begins/, /@BROWSER\-ends/, src_file)	
				output += fragment if fragment
			end

			Dir.chdir current_dir
		end

		File.open( "drafts-browser.js", "w+" ) do |browser_src|
        	browser_src.puts output
		end


		# puts "done .... #{output}"
		# `ls`
	end	

	def extract(begins_token, ends_token, src_file)
		src = File.open(src_file).read
		begins = src =~ begins_token
		ends = src =~ ends_token
		glob = src[begins..ends] if begins and ends

		return if glob.nil?

		glob = glob.gsub(begins_token, "")
		glob = glob.gsub(ends_token, "")
		glob
	end
end