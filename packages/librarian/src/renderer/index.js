export default class Renderer {
  renderers = [];

  add(renderer) {
    this.renderers.push(renderer);
  }

  remove(renderer) {
    const index = this.renderers.indexOf(renderer);
    if (index >= 0) {
      this.renderers.splice(index, 1);
    }
  }

  async render(...args) {
    await Promise.all(this.renderers.map((renderer) => renderer(...args)));
  }
}
