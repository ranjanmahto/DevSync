import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/xq-dark.css';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import axios from 'axios';



// import 'codemirror/addon/edit/matchbrackets';

const HtmlEditor = ({socketRef,roomId,setCode}) => {

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    
    if (textareaRef.current ) {
      editorRef.current = Codemirror.fromTextArea(document.getElementById("htmlEditor"), {
        lineNumbers: true,
        mode: 'htmlmixed',
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
                socketRef.emit('html-code-change',{code,roomId});

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
      socketRef.on('html-code-change',({code})=>{
        // console.log('html-code-change',code);
        if(code!==null)
        {
            editorRef.current.setValue(code);
            setCode(code);

        }
      })

      

      return () => {
        socketRef.off('html-code-change');
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
        const {htmlCode}= data.data;
        // console.log("htmlCode",data.data.roomId);
        if(htmlCode)
        {
        //   console.log("data.jsCode",htmlCode);
          editorRef.current.setValue(htmlCode);
          setCode(htmlCode);
        }
      }
      catch(err)
      {
        console.log(err);
      }
    }

    getCode();

    

  },[])

  return (
    <div className='text-white px-4 '>
      <textarea
        ref={textareaRef}
        id='htmlEditor'
        
        
      ></textarea>
    </div>
  );
};

export default HtmlEditor;
