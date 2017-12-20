import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class ItemView extends Component {

  render() {
    return (

      <tbody>
      {this.props.items.map(items => {
        return (<tr key={items.id}>

          <td>{items.name}</td>
          <td>{items.price}</td>
          <td>{items.quantity}</td>

          
          </tr>
        )
      })}
      </tbody>
    );
  }
}

export default ItemView;
