import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import axios from 'axios';




// import 'codemirror/addon/edit/matchbrackets';

const EditorComponent = ({socketRef,roomId,setCode}) => {

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    
    if (textareaRef.current ) {
      editorRef.current = Codemirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: true,
        mode: 'javascript',
        autoCloseBrackets: true,
        autoCloseTags: true,
        theme: 'xq-dark',
        scrollbarStyle: 'null',
        borderRadius: '10px',
        
      });

        editorRef.current.on('change',(instance,changes)=>{
          
          const {origin} = changes;
            
              if(origin!=='setValue')
              {
                const code= instance.getValue();
                setCode(code);
                socketRef.emit('code-change',{code,roomId});

              }
               
        })

        
        
      
      // editorRef.current.setSize('40%','40%');
      return () => {
        
        if (editorRef.current) {
          editorRef.current.toTextArea();
        }
      };
    }

      
    
  }, [textareaRef.current]);

  useEffect(()=>{

    

    if(socketRef)
    {
      socketRef.on('code-change',({code})=>{
        // console.log('code-change',code);
        if(code!==null)
        {
            editorRef.current.setValue(code);
            setCode(code);

        }
      })

      

      return () => {
        socketRef.off('code-change');
      };


    }
  },[socketRef])

  useEffect(()=>{

    async function getCode()
    {
      // console.log("ranjan");
      
      try{
        const {data}= await axios.post(`${BACKEND_URL}/get-code`,{roomId},{withCredentials:true});
        // console.log("data",data.data);
        const {jsCode}= data.data;
        // console.log("jsCode",data.data.roomId);
        if(jsCode)
        {
          // console.log("data.jsCode",jsCode);
          editorRef.current.setValue(jsCode);
          setCode(jsCode);
        }
      }
      catch(err)
      {
        // console.log('This room is empty');
      }
    }

    getCode();

    

  },[])

  return (
    <div className='text-white px-4 '>
      <textarea
        ref={textareaRef}
        id='editor'
        
        
      ></textarea>
    </div>
  );
};

export default EditorComponent;
