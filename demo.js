import { Component } from './src/component'

Component.create({
  tag: 'my-component',
  template: `
    <button m-on:click="toggle">Toggle</button>
    <input m-bind:value="itemName">
    <button m-on:click="addItem">Add Item</button>
    <ul m-if="shown">
      <li m-for="items">{{name}}</li>
    </ul>
  `,
  viewModel: {
    shown: true,
    message: 'Hello World!',
    items: [],
    itemName: '',
    toggle () {
      this.shown = !this.shown
    },
    addItem () {
      this.items.push({
        name: this.itemName
      })
      this.itemName = ''
    }
  }
})

document.body.appendChild(document.createElement('my-component'))
