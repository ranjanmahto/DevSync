import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/xq-dark.css';
import 'codemirror/mode/css/css.js';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import axios from 'axios';



// import 'codemirror/addon/edit/matchbrackets';

const CssEditor = ({socketRef,roomId,setCode}) => {

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    
    if (textareaRef.current ) {
      editorRef.current = Codemirror.fromTextArea(document.getElementById("cssEditor"), {
        lineNumbers: true,
        mode: 'css',
        autoCloseBrackets: true,
        autoCloseTags: true,
        theme: 'xq-dark',
        scrollbarStyle: 'null',
      });

        editorRef.current.on('change',(instance,changes)=>{
          
          const {origin} = changes;
            
              if(origin!=='setValue')
              {
                const code= instance.getValue();
                setCode(code);
                socketRef.emit('css-code-change',{code,roomId});

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
      socketRef.on('css-code-change',({code})=>{
        // console.log('css-code-change',code);
        if(code!==null)
        {
            editorRef.current.setValue(code);
            setCode(code);

        }
      })

      

      return () => {
        socketRef.off('css-code-change');
      };


    }
  },[socketRef])

  useEffect(()=>{

    async function getCode()
    {
    //   console.log("ranjan");
      
      try{
        const {data}= await axios.post(`${BACKEND_URL}/get-code`,{roomId},{withCredentials:true});
        // console.log("data",data.data);
        const {cssCode}= data.data;
        // console.log("cssCode",data.data.roomId);
        if(cssCode)
        {
        //   console.log("data.jsCode",cssCode);
          editorRef.current.setValue(cssCode);
         setCode(cssCode);
        }
      }
      catch(err)
      {
        console.log('This room is empty');
      }
    }

    getCode();

    

  },[])

  return (
    <div className='text-white px-4 '>
      <textarea
        ref={textareaRef}
        id='cssEditor'
        
        
      ></textarea>
    </div>
  );
};

export default CssEditor;
