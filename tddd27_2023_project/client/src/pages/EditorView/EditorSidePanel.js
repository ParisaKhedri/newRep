import React, {useEffect, useState, useRef} from 'react';
import {default as styles_css} from './styles.module.css';
import ImageFile from './ImageFile';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_ENTRY } from '../../GraphQL/Mutations';
import { LOAD_USER_JOURNALS } from '../../GraphQL/Queries';
import { LOAD_ALL_JOURNAL_ENTRIES } from '../../GraphQL/Queries';
import { Icon } from 'react-icons-kit';
import {ic_keyboard_arrow_down} from 'react-icons-kit/md/ic_keyboard_arrow_down';
import {list2} from 'react-icons-kit/icomoon/list2';
import {listNumbered} from 'react-icons-kit/icomoon/listNumbered';
import {paragraphRight} from 'react-icons-kit/icomoon/paragraphRight';
import {paragraphCenter} from 'react-icons-kit/icomoon/paragraphCenter';
import {paragraphLeft} from 'react-icons-kit/icomoon/paragraphLeft';
import {paragraphJustify} from 'react-icons-kit/icomoon/paragraphJustify';
import {pencil} from 'react-icons-kit/icomoon/pencil';
import {link} from 'react-icons-kit/icomoon/link';
import {smile} from 'react-icons-kit/icomoon/smile';
import {image} from 'react-icons-kit/icomoon/image';
import { EditorState, Editor, RichUtils } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import createStyles from 'draft-js-custom-styles';
import "draft-js/dist/Draft.css";

export default function EditorView(props) {
    let ref = useRef([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color', 'font-family', 'text-align']);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [headerOpen, setHeaderOpen] = useState(false);
    const [blockType, setBlockType] = useState('Normal');
    const [fontSizeOpen, setFontSizeOpen] = useState(false);
    const [fontTextSize, setFontTextSize] = useState('');
    const [fontOpen, setFontOpen] = useState(false);
    const [font, setFont] = useState('');
    const [images, setImages] = useState([]);

    const navigate = useNavigate();

    const headerElements = [['unstyled', 'Normal'], ['header-one', 'H1'], ['header-two', 'H2'], ['header-three', 'H3'], ['header-four', 'H4'], ['header-five', 'H5'], ['header-six', 'H6']];
    const textSizes = ['8px', '9px', '10px', '11px', '12px', '14px','16px', '18px', '20px', '22px', '24px', '26px', '28px', '36px', '48px', '72px'];
    const fontList = ['Courier New', 'Helvetica', 'Garamond', 'Georgia', 'Baskerville', 'Tahoma', 'Times New Roman', 'Arial', 'Verdana', 'Franklin Gothic', 'Sans-serif', 'Calibri', 'Palatino', 'Impact', 'Trebuchet MS'].sort();

    useEffect(() => {
        ref.current.focus();
    });


    const [createJournalEntry, {data, loading, error}] = useMutation(CREATE_ENTRY);

    if (loading) return 'Posting...';
    
    if (error) return `Posting error! ${error.message}`;


    function createHeaderList() {
        const headerListItems = headerElements.map((element) =>
        <li key={element[0]} className={styles_css.dropdown_item}>
            <button className={styles_css.header_item_button} onMouseDown={(event) => {
                event.preventDefault();
                onBlockTypeClick(element[0]);
                setHeaderOpen(!headerOpen);
            }}>{element[1]}</button>
        </li>
        );
        return headerListItems;
    }

    function createFontSizeList() {
        const fontSizeListItems = textSizes.map((element) => 
        <li key={element} className={styles_css.dropdown_item}>
            <button className={styles_css.header_item_button} onMouseDown={(event) => {
                event.preventDefault();
                if (handleHeaderSize()) {
                    onChange(editorState);
                    setFontSizeOpen(!fontSizeOpen);
                } else {
                    onChange(styles.fontSize.toggle(editorState, element));
                    setFontSizeOpen(!fontSizeOpen);
                }
            }}>{element}</button>
        </li>
        );
        return fontSizeListItems;
    }

    function createFontList() {
        const fontListItems = fontList.map((element) => 
        <li key={element} className={styles_css.dropdown_item}>
            <button className={styles_css.header_item_button} onMouseDown={(event) => {
                event.preventDefault();
                onChange(styles.fontFamily.toggle(editorState, element));
                setFontOpen(false);
            }}>{element}</button>
        </li>
        );
        return fontListItems;
    }

    function onChange(editorState) {
        setEditorState(editorState);
        handleDynamicDecorationType();
        handleDynamicFontSize();
        handleDynamicFont();
    }

    function handleHeaderSize() {
        if (RichUtils.getCurrentBlockType(editorState) == 'header-one' || 
            RichUtils.getCurrentBlockType(editorState) == 'header-two' || 
            RichUtils.getCurrentBlockType(editorState) == 'header-three' || 
            RichUtils.getCurrentBlockType(editorState) == 'header-four' || 
            RichUtils.getCurrentBlockType(editorState) == 'header-five' || 
            RichUtils.getCurrentBlockType(editorState) == 'header-six') {
            setFontTextSize('');
            return true;
        } else {
            return false;
        }
    }

    function handleDynamicFont() {
        if (styles.fontFamily.current(editorState) != font) {
            setFont(styles.fontFamily.current(editorState));
        }
        if (! !!styles.fontFamily.current(editorState)) {
            setFont('Verdana');
         }
    }

    function handleDynamicDecorationType() {
        if (RichUtils.getCurrentBlockType(editorState) != blockType && 
            (RichUtils.getCurrentBlockType(editorState) == 'unstyled' || RichUtils.getCurrentBlockType(editorState) == 'header-one' ||
                RichUtils.getCurrentBlockType(editorState) == 'header-two' || RichUtils.getCurrentBlockType(editorState) == 'header-three' ||
                RichUtils.getCurrentBlockType(editorState) == 'header-four' || RichUtils.getCurrentBlockType(editorState) == 'header-five' ||
                RichUtils.getCurrentBlockType(editorState) == 'header-six')) {
            if (RichUtils.getCurrentBlockType(editorState) == 'unstyled') {
                setBlockType('Normal');
            } else {
                setBlockType(RichUtils.getCurrentBlockType(editorState));
            }
        }
    }

    function handleDynamicFontSize() {
        if (styles.fontSize.current(editorState) != fontTextSize) {
            setFontTextSize(styles.fontSize.current(editorState));
        }
        if (! !!styles.fontSize.current(editorState)) {
            setFontTextSize('16px');
        }
        handleHeaderSize();
    }

    function handleKeyCommand (command){
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
          onChange(newState);
          return 'handled';
        }
        return 'not-handled';
    }

    function onStyleClick(style) {
        onChange(RichUtils.toggleInlineStyle(editorState, style));
    }

    function onBlockTypeClick(blockType) {
        onChange(RichUtils.toggleBlockType(editorState, blockType));

    }

    function onBlockStateClick(state) {
        onChange(styles.textAlign.toggle(editorState, state));
    }

    function handleImageClick() {
        setImages([...images, <ImageFile />]);
    }

    function postEntry() {
        const currentContent = editorState.getCurrentContent();
        const inlineStyles = exporter(editorState);
        const htmlCode = stateToHTML(currentContent, { inlineStyles });

        const result = createJournalEntry({variables: {
            body: htmlCode,
            journal_id: props.journal_id,
        },
            refetchQueries: [{query: LOAD_USER_JOURNALS, variables: {
                author_id: user.id
            }}, {query: LOAD_ALL_JOURNAL_ENTRIES, variables: {
                journal_id: props.journal_id,
            }}]
        });
        
        if (result) {
            navigate("/home");
        }
        
    }
    return (
        <div id={styles_css.editor_container}>
            <div id={styles_css.header_options_buttons}>
                <button className={styles_css.header_buttons} onClick={() => {
                    postEntry();
                }}>POST</button>
                <button className={styles_css.header_buttons}>REMOVE</button>
            </div>
            <div id={styles_css.editor_buttons_container}>
                <button className={styles_css.editor_button} onMouseDown={(event) => {
                    event.preventDefault();
                    onStyleClick('BOLD');
                    }}><b>B</b></button>
                <button className={styles_css.editor_button} onMouseDown={(event) => {
                    event.preventDefault();
                    onStyleClick('ITALIC');
                    }}><em>I</em></button>
                <button id={styles_css.underline_button} className={styles_css.editor_button} onMouseDown={(event) => {
                    event.preventDefault();
                    onStyleClick('UNDERLINE');
                    }}>U</button>
                <button id={styles_css.strike_through_button} className={styles_css.editor_button} onMouseDown={(event) => {
                    event.preventDefault();
                    onStyleClick('STRIKETHROUGH');
                }}>S</button>
                <div id={styles_css.header_dropdown} className={styles_css.dropdown_container}>
                    <button id={styles_css.header_button} className={styles_css.editor_button} onMouseDown={(event) => {
                            event.preventDefault();
                            setHeaderOpen(!headerOpen);
                    }}> {blockType} <Icon icon={ic_keyboard_arrow_down} size={20}/></button>
                    {headerOpen ? (
                        <ul className={styles_css.dropdown_menu}>
                            {createHeaderList()}
                        </ul>
                    ) : null}
                </div>
                <div id={styles_css.font_size_dropdown} className={styles_css.dropdown_container}>
                    <button id={styles_css.font_size_button} className={styles_css.editor_button} onMouseDown={(event) => {
                        event.preventDefault();
                        setFontSizeOpen(!fontSizeOpen);
                        }}>{fontTextSize}<Icon icon={ic_keyboard_arrow_down} size={20}/></button>
                    {fontSizeOpen ? (
                        <ul className={styles_css.dropdown_menu}>
                            {createFontSizeList()}
                        </ul>
                    ) : null}
                </div>
                <div id={styles_css.font_dropdown} className={styles_css.dropdown_container}>
                    <button id={styles_css.font_button} className={styles_css.editor_button} onMouseDown={(event) => {
                        event.preventDefault();
                        setFontOpen(!fontOpen);
                        }}>{font}<Icon icon={ic_keyboard_arrow_down} size={20}/></button>
                    {fontOpen ? (
                        <ul className={styles_css.dropdown_menu}>
                            {createFontList()}
                        </ul>
                    ) : null}
                </div>
                <button className={styles_css.editor_button} onMouseDown={(event) => {
                    event.preventDefault();
                    onBlockTypeClick("unordered-list-item")
                    }}><Icon icon={list2} size={15}/></button>
                <button className={styles_css.editor_button} onMouseDown={(event) => {
                    event.preventDefault();
                    onBlockTypeClick("ordered-list-item")
                    }}><Icon icon={listNumbered} size={15}/></button>
                <button className={styles_css.editor_button} onMouseDown={(event) => {
                    event.preventDefault();
                    onBlockStateClick('right');
                    }}><Icon icon={paragraphRight} size={15}/></button>
                <button className={styles_css.editor_button} onMouseDown={(event) => {
                    event.preventDefault();
                    onBlockStateClick('center');
                    }}><Icon icon={paragraphCenter} size={15}/></button>
                <button className={styles_css.editor_button} onMouseDown={(event) => {
                    event.preventDefault();
                    onBlockStateClick('left');
                    }}><Icon icon={paragraphLeft} size={15}/></button>
                <button className={styles_css.editor_button} onMouseDown={(event) => {
                    event.preventDefault();
                    onBlockStateClick('justify');
                    }}><Icon icon={paragraphJustify} size={15}/></button>
                    <button className={styles_css.editor_button} id={styles_css.draw_button} onMouseDown={(event) => {
                    event.preventDefault();
                    }}><Icon icon={pencil} size={15}/></button>
                <button className={styles_css.editor_button}  id={styles_css.link_button} onMouseDown={(event) => {
                    event.preventDefault();
                    }}><Icon icon={link} size={15}/></button>
                <button className={styles_css.editor_button}  id={styles_css.smile_button} onMouseDown={(event) => {
                    event.preventDefault();
                    }}><Icon icon={smile} size={15}/></button>
                <button className={styles_css.editor_button}  id={styles_css.image_button} onMouseDown={(event) => {
                    event.preventDefault();
                    handleImageClick()
                    }}><Icon icon={image} size={15}/></button>
            </div>
            <div id={styles_css.editor_text_container}>
                <div id={styles_css.added_images}>
                    {images.map((child) => { 
                        return <ImageFile key={child}/> })}
                </div>
                <Editor
                    ref={ref}
                    customStyleFn={customStyleFn}
                    onChange={onChange}
                    handleKeyCommand={handleKeyCommand}
                    editorState={editorState}>
                </Editor>
            </div>
        </div>
    );
}
