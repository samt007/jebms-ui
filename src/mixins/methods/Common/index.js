
// 完全复制对象。首先将distObj对象的属性清空，再将sourObj填充
function replaceObj(distObj,sourObj){
    if(distObj&&typeof distObj==='object'){
        Object.keys(distObj).forEach((key)=>{
            if(sourObj.hasOwnProperty(key)){
                distObj[key]=sourObj[key]
            }else{
                distObj[key]=null
            }
        })
        if(sourObj&&typeof sourObj==='object'){
            Object.keys(sourObj).forEach((key)=>{
                if(!distObj.hasOwnProperty(key)){
                    distObj[key]=sourObj[key]
                }
            })
        }else{
            throw new Error('sourObj is undefined or is not a object!');
        }
    }else{
        if(sourObj&&typeof sourObj==='object'){
            distObj=sourObj
        }else{
            throw new Error('sourObj is undefined or is not a object!');
        }
    }
}

// 对象不为空，并且存在1个以上的key
function isNotEmptyObj(obj){
    return obj&&Object.keys(obj).length
}

// 对比对象属性一致性
function isEqualObj(obj1,obj2){
    if(!(obj1&&typeof obj1==='object')){
        throw new Error('obj1 is undefined or is not a object!');
    }
    if(!(obj2&&typeof obj2==='object')){
        throw new Error('obj2 is undefined or is not a object!');
    }
    let l_return=true
    if(isNotEmptyObj(obj1)&&isNotEmptyObj(obj2)){
        Object.keys(obj1).forEach((key)=>{
            if(obj2.hasOwnProperty(key)){
                if(obj1[key]!==obj2[key]){
                    //console.log('obj1 key:'+key+':'+obj1[key]+'--'+obj2[key])
                    l_return=false
                }
            }else{
                //console.log('obj2 not have obj1 key:'+key)
                l_return=false
            }
        })
        Object.keys(obj2).forEach((key)=>{
            if(obj1.hasOwnProperty(key)){
                if(obj1[key]!==obj2[key]){
                    //console.log('obj2 key:'+key+':'+obj1[key]+'--'+obj2[key])
                    l_return=false
                }
            }else{
                //console.log('obj1 not have obj2 key:'+key)
                l_return=false
            }
        })
        return l_return
    }else{
        return l_return
    }
}

/**
 * Fire an event handler to the specified node. Event handlers can detect that the event was fired programatically
 * by testing for a 'synthetic=true' property on the event object
 * @param {HTMLNode} node The node to fire the event handler on.
 * @param {String} eventName The name of the event without the "on" (e.g., "focus")
 */
function fireEvent(node, eventName) {
    // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
    var doc;
    if (node.ownerDocument) {
        doc = node.ownerDocument;
    } else if (node.nodeType == 9){
        // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
        doc = node;
    } else {
        throw new Error("Invalid node passed to fireEvent: " + node.id);
    }

     if (node.dispatchEvent) {
        // Gecko-style approach (now the standard) takes more work
        var eventClass = "";

        // Different events have different event classes.
        // If this switch statement can't map an eventName to an eventClass,
        // the event firing is going to fail.
        switch (eventName) {
            case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
            case "mousedown":
            case "mouseup":
            case "mouseenter":
            case "mouseleave":
                eventClass = "MouseEvents";
                break;
                
            case "focus":
            case "change":
            case "blur":
            case "select":
                eventClass = "HTMLEvents";
                break;

            default:
                throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                break;
        }
        var event = doc.createEvent(eventClass);

        var bubbles = eventName == "change" ? false : true;
        event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

        event.synthetic = true; // allow detection of synthetic events
        node.dispatchEvent(event, true);
    } else if (node.fireEvent) {
        // IE-old school style
        var event = doc.createEventObject();
        event.synthetic = true; // allow detection of synthetic events
        node.fireEvent("on" + eventName, event);
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
    replaceObj,isNotEmptyObj,fireEvent,sleep,isEqualObj
};
