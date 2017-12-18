import React, { Component } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class ShoppinglistView extends Component {
  constructor(props) {
    super(props)
    this.state = { sname: '', shoppinglists: [], success: false, message:'', errors: { sname: '' }, editSuccess: false }
  }
  ViewClickHandler = (id) => {
    this.history.push('/dashboard/shoppinglist/'+id+'/items')
  }
  onInputChange = (evt) => {
    evt.preventDefault();
    let fields = {};
    fields[evt.target.name] = evt.target.value;
    this.setState(fields);
    this.setState({sname : evt.target.value})
    this.setState({ errors: { ...this.state.errors, [Object.keys(fields)[0]]: "" },});
    var errors = '';
    errors = this.validate(fields)
    if (errors) {
        return this.setState({ errors: { ...this.state.errors, [Object.keys(fields)[0]]: errors },});
    }
  }
  validate = (fields) => {
      var errors = '';
      // username validation
      if (fields.sname) {
        var usn = fields.sname
        if (usn.length < 3) {
            errors = "name should be three or more characters long";
            return errors;
        }
        if (usn.length > 30) {
            errors = "name too long";
            return errors;
        }
        // Regular expression to validate username
        var re = /^[a-zA-Z0-9_ -]+$/;
        if (!usn.match(re)) {
            errors = "invalid shoppinglist name";
            return errors;
        }
      }
  }
  handleSubmit=(id, evt)=> {
      evt.preventDefault();
      if (this.state.errors.sname !== '') {
        toast.error("Please enter a valid shoppinglist name")
      }else{
        this.sendEditRequest(this.state.sname, id);
      }
  }
  sendEditRequest(sname, id) {
    var self =this;
      var data = { 'name': sname}
      const url = 'https://fancy-shoppinglist-api.herokuapp.com/shoppinglists/' + id;
      axios({
          method: "put",
          url: url,
          headers: {
              'Auth': window.localStorage.getItem('token')
          },
          data: data
      }).then(function (response) {
          if (!response.statusText === 'OK') {
              toast.error(response.data.message)
          }
          self.setState({shoppinglists:self.state.shoppinglists.filter(shoppinglists => shoppinglists.id !== id )});
          let newShopp = self.state.shoppinglists.slice();
          newShopp.push(response.data);
          self.setState({shoppinglists:newShopp})
          toast.success("Shoppinglist edited")
          self.setState({ editSuccess: true })
          return response.data;
      }).catch(function (error) {
          if (error.response) {
              console.log(error.response.data);
              toast.error(error.response.data.message)
          } else if (error.request) {
              // No response received
              console.log(error.request);
          } else {
              // Request error
              console.log('Error', error.message);
          }
          console.log(error.config);
      });
  }
  DeleteClickHandler = (id, name) => {
    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure you want to delete  ' + name,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm: () => this.deleteRequest(id),
    })
    console.log(id)

  }
  ShareClickHandler = (id, name, request) => {
    confirmAlert({
      title: 'Confirm '+ request,
      message: 'Are you sure you want to '+ request + ' ' + name +'?',
      confirmLabel: request,
      cancelLabel: 'Cancel',
      onConfirm: () => this.shareRequest(id),
    })
  }
  deleteRequest=(id)=> {
    // Send GET request
       const url = 'https://fancy-shoppinglist-api.herokuapp.com/shoppinglists/' + id;
       axios({
           method: "delete",
           url: url,
           headers: {
               'Auth': window.localStorage.getItem('token')
           }
       }).then((response) => {
           if (!response.statusText === 'OK') {
               toast.error(response.data.message)
           }
           this.setState({shoppinglists:this.state.shoppinglists.filter(shoppinglists => shoppinglists.id !== this.state.id )});
           return response.data;
       }).catch(function (error) {
           if (error.response) {
               console.log(error.response.data);
               toast.error(error.response.data.message)
           } else if (error.request) {
               console.log(error.request);
           } else {
               console.log('Error', JSON.stringify(error.message));
           }
           console.log(error.config);
       });
  }
  shareRequest=(id)=> {
    // Send GET request
       const url = 'https://fancy-shoppinglist-api.herokuapp.com/shoppinglists/share/' + id;
       axios({
           method: "put",
           url: url,
           headers: {
               'Auth': window.localStorage.getItem('token')
           }
       }).then((response) => {
           if (!response.statusText === 'OK') {
               toast.error(response.data.message)
           }
           toast.success('Success')
           return response.data;
       }).catch(function (error) {
           if (error.response) {
               console.log(error.response.data);
               toast.error(error.response.data.message)
           } else if (error.request) {
               console.log(error.request);
           } else {
               console.log('Error', JSON.stringify(error.message));
           }
           console.log(error.config);
       });
  }
  render() {
    return (
      <div id="accordion" data-children=".icon-link-e" className="">
      {this.props.shoppinglists.map(shoppinglists => {
        var share_status = ''
        if (shoppinglists.shared) {
          share_status = <a onClick={(e) => this.ShareClickHandler(shoppinglists.id, shoppinglists.name, "Unshare", e)} className="icon-link2" data-toggle="tooltip" title="unshare"><span className="fa fa-reply"></span></a>
        } else {
          share_status =<a onClick={(e) => this.ShareClickHandler(shoppinglists.id, shoppinglists.name, "Share", e)} className="icon-link2" data-toggle="tooltip" title="Share"><span className="fa fa-share-alt "></span></a>
        }
      return (<div> <div className="spanel-item" key={shoppinglists.id}>
                <a href={'/dashboard/shoppinglist/'+shoppinglists.id+'/items'}><h4>{shoppinglists.name}</h4></a>
                 <div className="text-right action">

                  {share_status}
                   <a className="icon-link-e" data-toggle="modal" data-target={"#editModal"+shoppinglists.id} title="Edit"><span className="fa fa-edit "></span></a>
                  <a onClick={(e) => this.DeleteClickHandler(shoppinglists.id, shoppinglists.name, e)} className="icon-link1" data-toggle="tooltip" title="Delete"><span className="fa fa-trash-o "></span></a>
                 </div>

               </div>

               <div className="modal fade" id={"editModal"+shoppinglists.id} role="dialog">
               <ToastContainer hideProgressBar={true} />
                 <div className="modal-dialog">

                   <div className="modal-content  mdl">
                     <div className="modal-header">
                       <i className="close" data-dismiss="modal">&times;</i>
                       <h4 className="modal-title">Edit shoppinglist: {shoppinglists.name}</h4>
                     </div>
                     <div className="modal-body">
                       <form className="form" onSubmit={(evt)=>this.handleSubmit(shoppinglists.id, evt)} >
                      <label className="f-label m-label"> name: <span className="text-err">{ this.state.errors.sname }</span></label>
                       <div className="input-group">
                         <input type="text" name="sname" className={this.state.errors.sname ? "form-control f-error":"form-control" } onInput={this.onInputChange} value={this.state.sname} placeholder={shoppinglists.name} required />
                         <span className="input-group-btn">
                           <button className="btn btn-success" type="submit">
                              edit
                           </button>
                         </span>
                       </div>
                       </form>
                     </div>
                   </div>

                 </div>
               </div>

               </div>
               )
          })
         }
      </div>
    );
  }
}

export default ShoppinglistView;
