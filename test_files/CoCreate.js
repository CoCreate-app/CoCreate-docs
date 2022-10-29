
  /**
  @value_start
  updateDocument({
    collection: "test123",
    document_id: "document_id",
    document:{
    	example: “some example can be html json etc”,
    	description:  “update documnets if document does not exist otherwise create”
    },
  })
  @value_end
  */
  updateDocument: function(info) {
    if( !info || !info['document_id'] ) return;
    
    let request_data = this.getCommonParams();
    request_data['collection'] = info['collection'] || 'module_activities';
    request_data['document_id'] = info['document_id'];
    
    if( typeof info['data'] === 'object' ) request_data['set'] = info['data'];
    if( Array.isArray(info['delete_fields']) ) request_data['unset'] = info['delete_fields'];
    
    if(!request_data['set'] && !request_data['unset']) return;
    
    request_data['element'] = info['element'];
    request_data['metadata'] = info['metadata'];
    
    if (info.broadcast === false) {
      request_data['broadcast'] = false;
    }
        
    const room = this.generateSocketClient(info.namespace, info.room);
    CoCreateSocket.send('updateDocument', request_data, room);
  },
  
  
  /**
   @value_start
  readDocument({
    collection: "test123",
    document_id: "document_id",
    element: “xxxx”,
    metaData: "xxxx",
    exclude_fields: [] 
  })
  @value_end
  */
  readDocument: function(info) {
    if (info === null) {
      return;
    }
    if (!info['document_id'] || !info) {
      return;
    }
    
    let request_data = this.getCommonParams();
    request_data['collection'] = info['collection'];
    request_data['document_id'] = info['document_id'];
    if (info['exclude_fields']) {
      request_data['exclude_fields'] = info['exclude_fields'];
    }
    
    if (info['element']) {
      request_data['element'] = info['element'];
    }
    
    request_data['metadata'] = info['metadata']
    CoCreateSocket.send('readDocument', request_data);
  },
  
  
  /**
   * @value_start
  deleteDocument({
    namespace: '',
    room: '',
    broadcast: true/false,
    broadcastSender: true/false,
    
    collection: "module",
    document: {_id: ""},
    element: “xxxx”,
    metadata: "xxxx"
  })
  @value_end
  */
  deleteDocument: function(info) {
    if (!info['document_id'] || !info) {
      return;
    }
    
    let request_data = this.getCommonParams();
    request_data['collection'] = info['collection'];
    request_data['document_id'] = info['document_id'];
    
    if (info['element']) {
      request_data['element'] = info['element'];
    }
    
    request_data['metadata'] = info['metadata']
    
    const room = this.generateSocketClient(info.namespace, info.room);
    CoCreateSocket.send('deleteDocument', request_data, room);
  }
