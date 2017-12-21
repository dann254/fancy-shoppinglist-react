import React, { Component } from "react";

class ItemView extends Component {
  // render item rows
  render() {
    return (
      <tbody>
        {this.props.items.map(items => {
          return (
            <tr key={items.id}>
              <td>{items.name}</td>
              <td>{items.price}</td>
              <td>{items.quantity}</td>
            </tr>
          );
        })}
      </tbody>
    );
  }
}

export default ItemView;
