import {getFirstMatch} from './utilities';
import {ComponentType, PropType} from '../entities';
import {TypeType} from 'librarian-plugin-javascript/src/entities';

describe('component', () => {

  function getFirstComponent(source, {prefixWithImport = true} = {}) {
    if (prefixWithImport && source.trim().indexOf('import React') !== 0) {
      source = `import React, {Component, PropTypes} from 'react';\n${source}`;
    }

    return getFirstMatch({source, type: ComponentType});
  }

  function getFirstProp(source, opts) {
    return getFirstComponent(source, opts).props[0];
  }

  describe('component identification', () => {
    it('finds class-based components', () => {
      const component = getFirstComponent(`
        export default class MyComponent extends Component {}
      `);

      expect(component)
        .to.be.an.entityOfType(ComponentType)
        .with.properties({name: 'MyComponent'});
    });

    it('finds stateless components', () => {
      const component = getFirstComponent(`
        export default function MyComponent() {
          return <div />;
        }
      `);

      expect(component)
        .to.be.an.entityOfType(ComponentType)
        .with.properties({name: 'MyComponent'});
    });

    it('finds stateless components with conditional render paths', () => {
      const component = getFirstComponent(`
        export default function MyComponent() {
          if (true) { return <div />; }
          return null;
        }
      `);

      expect(component)
        .to.be.an.entityOfType(ComponentType)
        .with.properties({name: 'MyComponent'});
    });

    it('finds stateless components as arrow functions', () => {
      const component = getFirstComponent(`
        export default () => {
          if (true) { return <div />; }
          return null;
        }
      `);

      expect(component).to.be.an.entityOfType(ComponentType);
    });

    it('finds stateless components as body-less arrow functions', () => {
      const component = getFirstComponent(`
        export default () => (<div />);
      `);

      expect(component).to.be.an.entityOfType(ComponentType);
    });

    it('does not find non-matching classes', () => {
      expect(getFirstComponent('export default class MyComponent {}')).to.be.undefined;
    });

    it('does not find non-matching functions', () => {
      expect(getFirstComponent('export default function MyComponent() { return div; }')).to.be.undefined;
    });

    it('does not find nested JSX-returning functions', () => {
      expect(getFirstComponent(`
        export default function MyComponent() {
          const myFunc = () => (<div />);
          return div;
        }
      `)).to.be.undefined;
    });
  });

  describe('props', () => {
    it('finds static class props', () => {
      const component = getFirstComponent(`
        export default class MyComponent extends Component {
          static propTypes = {selected: PropTypes.bool};
        }
      `);

      expect(component)
        .to.have.deep.property('props[0]')
        .to.be.an.entityOfType(PropType)
        .with.properties({name: 'selected'});
    });

    it('finds statically declared props', () => {
      const component = getFirstComponent(`
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

    describe('.isRequired', () => {
      it('is not required by default', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool};
          }
        `);

        expect(prop).to.have.properties({isRequired: false});
      });

      it('is required when isRequired is called', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool.isRequired};
          }
        `);

        expect(prop).to.have.properties({isRequired: true});
      });

      it('is not required with a non-matching computed key', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool[isRequired]};
          }
        `);

        expect(prop).to.have.properties({isRequired: false});
      });

      it('is not required with a matching evaluated computed key', () => {
        const prop = getFirstProp(`
          const isRequired = 'isRequired';

          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool[isRequired]};
          }
        `);

        expect(prop).to.have.properties({isRequired: true});
      });

      it('is required with a matching computed key', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool['isRequired']};
          }
        `);

        expect(prop).to.have.properties({isRequired: true});
      });

      it('evaluates the property of the required type', () => {
        const prop = getFirstProp(`
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
      it('handles a boolean type', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool};
          }
        `);

        expect(prop)
          .to.have.deep.property('type.type')
          .that.equals('boolean');
      });

      it('handles a string type', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.string};
          }
        `);

        expect(prop)
          .to.have.deep.property('type.type')
          .that.equals('string');
      });

      it('handles a number type', () => {
        const prop = getFirstProp(`
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
