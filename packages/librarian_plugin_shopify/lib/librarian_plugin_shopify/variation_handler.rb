require 'yard'

module Librarian
  module Plugin
    module Shopify
      class VariantHandler < YARD::Handlers::Ruby::Base
        handles method_call(:variant)
        namespace_only

        def process
          variant_name = statement.parameters.first.jump(:tstring_content, :ident).source
          options = {name: variant_name, description: statement.comments}

          statement.parameters[1..-2].each do |parameter|
            parameter.jump(:hash).children.each do |child|
              option_name = child.first.source.sub(':', '').to_sym
              options[option_name] = ast_to_source(child.last)
            end
          end

          namespace[:variations] ||= []
          namespace[:variations].push(default_options.merge(options))
        end

        private

        def default_options
          {
            description: nil,
            accepts: [true, false],
            default: nil,
            required: false
          }
        end

        def ast_to_source(ast)
          if ast.type == :array
            ast.first.to_a.map { |option| ast_to_source(option) }
          elsif ast.type == :var_ref
            ast.jump(:kw).last == 'true'
          elsif ast.type == :symbol_literal
            ast.source
          else
            nil
          end
        end
      end
    end
  end
end
