import {execSync} from 'child_process';
import {componentTransformer} from './transformers';

export default function processor({filename, source}, {config}) {
  config.logger(`Processing ${filename}`, {
    plugin: 'shopify',
  });

  const data = execSync(`bundle exec librarian_plugin_shopify ${filename}`).toString();

  try {
    const result = JSON.parse(data);
    return (result.components || []).map(componentTransformer);
  } catch (error) {
  }

  return [];
}
