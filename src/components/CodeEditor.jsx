import React from 'react';

const CodeEditor = () => {
  const codeLines = [
    { num: 1, content: <><span className="keyword">import</span> React <span className="keyword">from</span> <span className="string">'react'</span><span className="punctuation">;</span></> },
    { num: 2, content: '' },
    { num: 3, content: <><span className="keyword">const</span> <span className="function">Portfolio</span> <span className="punctuation">=</span> <span className="punctuation">()</span> <span className="keyword">=&gt;</span> <span className="punctuation">{'{'}</span></> },
    { num: 4, content: <>  <span className="keyword">return</span> <span className="punctuation">(</span></> },
    { num: 5, content: <>    <span className="jsx-tag">&lt;div</span> <span className="property">className</span><span className="punctuation">=</span><span className="string">"portfolio"</span><span className="jsx-tag">&gt;</span></> },
    { num: 6, content: <>      <span className="jsx-tag">&lt;h1&gt;</span>Welcome<span className="jsx-tag">&lt;/h1&gt;</span></> },
    { num: 7, content: <>      <span className="jsx-tag">&lt;p&gt;</span>Building amazing</> },
    { num: 8, content: <>         web experiences<span className="jsx-tag">&lt;/p&gt;</span></> },
    { num: 9, content: <>    <span className="jsx-tag">&lt;/div&gt;</span></> },
    { num: 10, content: <>  <span className="punctuation">);</span></> },
    { num: 11, content: <><span className="punctuation">{'}'};</span></> },
    { num: 12, content: '' },
    { num: 13, content: <><span className="keyword">export</span> <span className="keyword">default</span> Portfolio<span className="punctuation">;</span></> }
  ];

  return (
    <div className="code-editor w-full max-w-md">
      <div className="code-editor-header">
        <div className="code-editor-dots">
          <div className="dot dot-red"></div>
          <div className="dot dot-yellow"></div>
          <div className="dot dot-green"></div>
        </div>
        <div className="code-editor-title">
          <i className="fab fa-react"></i> Portfolio.jsx
        </div>
        <div style={{ width: '60px' }}></div>
      </div>
      <div className="code-editor-body">
        {codeLines.map((line) => (
          <div key={line.num} className="code-line">
            <span className="line-number">{line.num}</span>
            <span className="line-content">{line.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeEditor;
