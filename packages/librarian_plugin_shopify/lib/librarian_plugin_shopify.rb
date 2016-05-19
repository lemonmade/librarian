require 'yard'
require 'json'

require "librarian_plugin_shopify/variation_handler"
require "librarian_plugin_shopify/helper_tag"
require "librarian_plugin_shopify/snippet_tag"

module Librarian
  module Plugin
    module Shopify
      def self.parse(file)
        YARD::CLI::CommandParser.run('doc', file, '--quiet', '--no-output')
        YARD::Registry.load!

        components = YARD::Registry.all(:class).map do |component|
          {
            name: component.name,
            helper: component.has_tag?(:helper) ? component.tag(:helper).text : nil,
            snippet: component.has_tag?(:snippet) ? component.tag(:snippet).text : nil,
            variations: component[:variations] || [],
            methods: component.meths
              .reject { |meth| component.inherited_meths.include?(meth) || meth.name == :render }
              .map { |meth| meth.name }
          }
        end

        puts JSON.generate(components: components)
      end
    end
  end
end
