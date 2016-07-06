import {getFirstMatch, getLibraryFromFiles} from './utilities';
import {ComponentType, PropType} from '../entities';
import {TypeType} from '../../javascript/entities';

describe('component', () => {
  async function getFirstComponent(source, {prefixWithImport = true} = {}) {
    if (prefixWithImport && source.trim().indexOf('import React') !== 0) {
      source = `import React, {Component, PropTypes} from 'react';\n${source}`;
    }

    return await getFirstMatch({source, type: ComponentType});
  }

  async function getFirstProp(source, opts) {
    const component = await getFirstComponent(source, opts);
    return component.props[0];
  }

  describe('component identification', () => {
    it('finds class-based components', async () => {
      const component = await getFirstComponent(`
        export default class MyComponent extends Component {}
      `);

      expect(component)
        .to.be.an.entityOfType(ComponentType)
        .with.properties({name: 'MyComponent'});
    });

    it('finds stateless components', async () => {
      const component = await getFirstComponent(`
        export default function MyComponent() {
          return <div />;
        }
      `);

      expect(component)
        .to.be.an.entityOfType(ComponentType)
        .with.properties({name: 'MyComponent'});
    });

    it('finds stateless components with conditional render paths', async () => {
      const component = await getFirstComponent(`
        export default function MyComponent() {
          if (true) { return <div />; }
          return null;
        }
      `);

      expect(component)
        .to.be.an.entityOfType(ComponentType)
        .with.properties({name: 'MyComponent'});
    });

    it('finds stateless components as arrow functions', async () => {
      const component = await getFirstComponent(`
        export default () => {
          if (true) { return <div />; }
          return null;
        }
      `);

      expect(component).to.be.an.entityOfType(ComponentType);
    });

    it('finds stateless components as body-less arrow functions', async () => {
      const component = await getFirstComponent(`
        export default () => (<div />);
      `);

      expect(component).to.be.an.entityOfType(ComponentType);
    });

    it('does not find non-matching classes', async () => {
      expect(await getFirstComponent('export default class MyComponent {}')).to.be.undefined;
    });

    it('does not find non-matching functions', async () => {
      expect(await getFirstComponent('export default function MyComponent() { return div; }')).to.be.undefined;
    });

    it('does not find nested JSX-returning functions', async () => {
      expect(await getFirstComponent(`
        export default function MyComponent() {
          const myFunc = () => (<div />);
          return div;
        }
      `)).to.be.undefined;
    });
  });

  describe('props', () => {
    it('finds static class props', async () => {
      const component = await getFirstComponent(`
        export default class MyComponent extends Component {
          static propTypes = {selected: PropTypes.bool};
        }
      `);

      expect(component)
        .to.have.deep.property('props[0]')
        .to.be.an.entityOfType(PropType)
        .with.properties({name: 'selected'});
    });

    it('finds statically declared props', async () => {
      const component = await getFirstComponent(`
        export default function MyComponent() {
          return <div />;
        }

        MyComponent.propTypes = {selected: PropTypes.bool};
      `);

      expect(component)
        .to.have.deep.property('props[0]')
        .to.be.an.entityOfType(PropType)
        .with.properties({name: 'selected'});
    });

    it('finds props declared in another file', async () => {
      const library = await getLibraryFromFiles([
        {
          source: `
            import {PropTypes} from 'react';
            export default {selected: PropTypes.bool};
          `,
          filename: 'example1.js',
        },
        {
          source: `
            import React, {Component} from "react";
            import propTypes from './example1';

            export default class MyComponent extends Component {
              static propTypes = propTypes;
            }
          `,
          filename: 'example2.js',
        },
      ]);

      const component = library.find({name: 'MyComponent'});

      expect(component)
        .to.have.deep.property('props[0]')
        .to.be.an.entityOfType(PropType)
        .with.properties({name: 'selected'});
    });

    it('finds props declared as a flow type', async () => {
      const component = await getFirstComponent(`
        type Props = {
          selected: boolean,
        };

        export default class MyComponent extends Component {
          props: Props;
        }
      `);

      expect(component)
        .to.have.deep.property('props[0]')
        .to.be.an.entityOfType(PropType)
        .with.properties({name: 'selected'});
    });

    describe('.isRequired', () => {
      it('is not required by default', async () => {
        const prop = await getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool};
          }
        `);

        expect(prop).to.have.properties({isRequired: false});
      });

      it('is required when isRequired is called', async () => {
        const prop = await getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool.isRequired};
          }
        `);

        expect(prop).to.have.properties({isRequired: true});
      });

      it('is not required with a non-matching computed key', async () => {
        const prop = await getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool[isRequired]};
          }
        `);

        expect(prop).to.have.properties({isRequired: false});
      });

      it('is not required with a matching evaluated computed key', async () => {
        const prop = await getFirstProp(`
          const isRequired = 'isRequired';

          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool[isRequired]};
          }
        `);

        expect(prop).to.have.properties({isRequired: true});
      });

      it('is required with a matching computed key', async () => {
        const prop = await getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool['isRequired']};
          }
        `);

        expect(prop).to.have.properties({isRequired: true});
      });

      it('evaluates the property of the required type', async () => {
        const prop = await getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool.isRequired};
          }
        `);

        expect(prop)
          .to.have.property('type')
          .that.is.an.entityOfType(TypeType)
          .with.properties({type: 'boolean'});
      });
    });

    describe('.type', () => {
      it('handles a boolean type', async () => {
        const prop = await getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool};
          }
        `);

        expect(prop)
          .to.have.deep.property('type.type')
          .that.equals('boolean');
      });

      it('handles a string type', async () => {
        const prop = await getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.string};
          }
        `);

        expect(prop)
          .to.have.deep.property('type.type')
          .that.equals('string');
      });

      it('handles a number type', async () => {
        const prop = await getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.number};
          }
        `);

        expect(prop)
          .to.have.deep.property('type.type')
          .that.equals('number');
      });
    });
  });
});
