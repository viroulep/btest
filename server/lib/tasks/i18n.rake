# frozen_string_literal: true

namespace :i18n do
  task export: "i18n:js:export" do
    content = <<~JSFILE
      // This file is generated automatically by the i18n:export rake task!
      // DO NOT EDIT IT MANUALLY!
      const localeImporters = {
      %s
      };
      const availableLocales = Object.keys(localeImporters);
      const defaultLocale = '%s';
      export { localeImporters, availableLocales, defaultLocale };
    JSFILE
    # Emit additional js files for the client
    File.open(Rails.root.join("generated_locales/importers.js"), "w+") do |f|
      list = I18n.available_locales.map do |l|
        "  #{l}: () => import('./#{l}'),"
      end.join("\n")
      f.write(format(content, list, I18n.default_locale))
    end
  end
end
