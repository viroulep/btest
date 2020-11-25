namespace :i18n do
  task export: "i18n:js:export" do
    content = <<-EOF
// This file is generated automatically by the i18n:export rake task!
// DO NOT EDIT IT MANUALLY!
const localeImporters = {
%s
};

const availableLocales = Object.keys(localeImporters);
const defaultLocale = '%s';
export { localeImporters, availableLocales, defaultLocale };
EOF
    # Emit additional js files for the client
    File.open(Rails.root.join('generated_locales', 'importers.js'), 'w+') do |f|
      # fr: () => import('./locales/fr'),
      list = I18n.available_locales.map do |l|
        "  #{l}: () => import('./#{l}'),"
      end.join("\n")
      f.write(content % [list, I18n.default_locale])
    end
  end
end
