import {execSync} from 'child_process';
import {componentTransformer} from './transformers';

export default function processor(file) {
  console.log(`Processing ${file} with 'librarian-plugin-shopify'`);

  const data = execSync(`bundle exec librarian_plugin_shopify ${file}`).toString();

  try {
    const result = JSON.parse(data);
    return (result.components || []).map(componentTransformer);
  } catch (error) {
  }

  return [];
}
