import { Component } from './src/component'

Component.create({
  tag: 'my-component',
  template: `
    <form m-on:submit="addItem">
      <input m-bind:value="itemName">
      <button type="submit">Create Todo</button>
    </form>
    <ul>
      <li m-for="items">
        {{$value}}
        <button m-on:click="deleteItem">x</button>
      </li>
    </ul>
  `,
  viewModel: {
    items: [],
    itemName: '',
    addItem (event) {
      event.preventDefault()
      this.items.push(this.itemName)
      this.itemName = ''
    },
    deleteItem (event, { $index }) {
      this.items.splice($index, 1)
    }
  }
})

document.body.appendChild(document.createElement('my-component'))
