// script to create survey dynamically
(function (doc) {
    function domLoaded(callback) {
        var addEvt = doc.addEventListener || doc.attachEvent,
            removeEvt = doc.removeEventListener || doc.detachEvent,
            evtName = doc.addEventListener ? "DOMContentLoaded" : "onreadystatechange";

        addEvt.call(doc, evtName, function () {
            callback();
            removeEvt(evtName, arguments.callee, false);
        }, false);
    }

    var trim = function (str) { return str.replace(/^(\s+)/, '').replace(/(\s+)$/, ''); }
    getElm = function (id) { return doc.getElementById(id); },
        hasClass = function (elm, name) {
            if (elm.classList) {
                return elm.classList.contains(name);
            }
            // simple fast check, no strict class checking
            // will fail on similar classes, i.e. 'btn-small', 'btn' will all match 'btn'
            return elm.className && elm.className.indexOf(name) !== -1;
        },
        addClass = function (elm, name) {
            if (elm.classList) {
                return elm.classList.add(name);
            }
            if (elm.className.indexOf(name) === -1) {
                elm.className += ' ' + name;
            }
        },
        removeClass = function (elm, name) {
            if (elm.classList) {
                return elm.classList.remove(name);
            }
            elm.className = trim(elm.className.replace(new RegExp(name, 'i'), ''));
        },
        createElm = function (tag, attrs) {
            var elm = doc.createElement(tag);

            attrs = attrs || {};

            for (var k in attrs) {
                if (attrs.hasOwnProperty(k)) {
                    elm[k] = attrs[k];
                }
            }

            return elm;
        },
        getChildByClass = function (elm, name) {
            // looking only 1 level deep
            for (var i = 0; i < elm.childNodes.length; i++) {
                if (hasClass(elm.childNodes[i], name)) return elm.childNodes[i];
            };
            return false;
        },
        onEvent = function (elm, eventName, callback) {
            if (elm.addEventListener) {
                elm.addEventListener(eventName, callback, false);
            } else if (elm.attachEvent) {
                elm.attachEvent(eventName, callback);
            }
        },
        onClick = function (elm, callback) {
            onEvent(elm, 'click', callback);
        }


    var Survey = {
        items: [],
        counter: 0,

        /**
         * Generate unique id
         */
        getNextId: function () {
            return ++this.counter;
        }
    };

    function createQuestionControls(qid) {
        var containerId = qid,
            controls = createElm('div', { className: 'controls' }),
            rmBtn = createElm('a', { className: 'btn small text-danger font-12', innerHTML: 'x Remove', title: 'Remove question' }),
            addOptBtn = createElm('a', { className: 'btn small add-answer color-primary font-12', innerHTML: '+ Add', title: 'Add answer option', 'data-cid': containerId });

        onClick(rmBtn, function () {
            if (confirm('Are you sure you want to remove this question?')) {
                var container = getElm(containerId);
                container.parentNode.removeChild(container);
            }
        });

        controls.appendChild(addOptBtn);
        controls.appendChild(rmBtn);
        return controls;
    }

    function createAnswerControls(elm) {
        var answerElm = elm,
            controls = createElm('div', { className: 'controls my-auto' }),
            rmBtn = createElm('a', { className: 'btn mini text-danger ml-2 font-12 p-0', innerHTML: 'x Remove', title: 'Remove question' });
        //No need for mini-question for now
        // addOptBtn = createElm('a', { className: 'btn mini add-question', innerHTML: '+Q', title: 'Add question' });
        onClick(rmBtn, function () {
            elm.parentNode.removeChild(elm);
        });
        controls.appendChild(rmBtn);
        return controls;
    }

    function appendQuestion(elm) {
        var id = Survey.getNextId(),
            newQ = createElm('div', { className: 'question p-3 my-2 dash_card', id: 'q_' + id }),
            answerOptions = createElm('div', { className: 'answer-opt' }),
            typeSel = getElm('answer_options').cloneNode(true);

        typeSel.id = 't_q_' + id;

        newQ.appendChild(createElm('input', { value: '', placeholder: 'Ask a question...', type: 'text', className: 'form-control font-14 mb-2' }));
        answerOptions.appendChild(typeSel);
        newQ.appendChild(answerOptions);
        newQ.appendChild(createElm('input', { value: '', placeholder: 'Required', type: 'checkbox', className: 'required', style: 'margin-top: 1rem' }));
        newQ.appendChild(createElm('label', { innerHTML: 'Required', className: 'font-14 ml-2' }));


        var sel = typeSel.getElementsByTagName('select')[0],
            inp = typeSel.getElementsByTagName('input')[0];

        var ans_div = newQ.appendChild(createElm('ol', { className: 'answers', id: 'a_q_' + id }));
        ans_div.classList.add('my-2')
        var q_cont_div = newQ.appendChild(createQuestionControls(newQ.id));
        var q_cont_add = getChildByClass(q_cont_div, 'add-answer');
        q_cont_add.classList.add('hidden');

        onEvent(sel, 'change', function () {
            if (sel.value == 'stars') {
                removeClass(inp, 'hidden');
                addClass(inp, 'stars');
                inp.placeholder = 'Enter number of stars for input (Max is 7)';
                inp.style.fontSize = '14px';
                inp.type = 'number';
                inp.setAttribute('max', 7);
                onEvent(inp, 'change', function () {
                    var value = parseInt(this.value);
                    var max = parseInt(this.max);
                    if (value > max) {
                        this.classList.add('border', 'border-danger');
                    } else {
                        this.classList.remove('border', 'border-danger');
                    }
                })
            } else {
                addClass(inp, 'hidden');
            }
            if (sel.value == 'text' || sel.value == 'textarea' || sel.value == 'stars') {
                q_cont_add.classList.add('hidden');
                ans_div.innerHTML = "";
            } else {
                q_cont_add.classList.remove('hidden');
            }
        });

        elm.appendChild(newQ);
        // append draggable stuff
        return newQ
    }

    function createCheckbox(label, value) {
        var labelElm = createElm('label', { innerHTML: 'User input?', title: 'User will be asked to input data', className: 'my-2 d-flex font-12' }),
            chbxElm = createElm('input', { type: 'checkbox', checked: false, value: 'user-input', className: 'mr-2 my-auto' });

        labelElm.insertBefore(chbxElm, labelElm.firstChild);

        return labelElm;
    }

    function appendAnswer(elm) {
        var opt = createElm('li', { className: 'answer font-14' });

        opt.appendChild(createElm('input', { value: '', placeholder: 'Enter an answer option', className: 'form-control font-14', type: 'text' }));
        var opt_controls = opt.appendChild(createElm('div', { className: 'mb-2 d-flex' }))
        opt_controls.appendChild(createCheckbox('User input', 'user-input'));
        opt_controls.appendChild(createAnswerControls(opt));

        return elm.appendChild(opt);
    }


    function snapshotSave(rootElm) {
        if (!rootElm || !rootElm.childNodes) {
            return null;
        }

        var tree = [],
            _getAnswerChecbox = function (elm) {
                for (var i = 0; i < elm.childNodes.length; i++) {
                    if (elm.childNodes[i].tagName == 'LABEL') {
                        return elm.childNodes[i].getElementsByTagName('input')[0].checked;
                    }
                };
                return false;
            };

        // iterate question li's
        for (var i = 0; i < rootElm.childNodes.length; i++) {
            var qelm = rootElm.childNodes[i];

            if (!hasClass(qelm, 'question')) continue;

            var optsElm = getElm('t_' + qelm.id),
                q = {
                    name: qelm.firstChild.value, //input with name comes first
                    type: optsElm.getElementsByTagName('select')[0].value, // type select
                    options: getChildByClass(optsElm, 'type-options').value,
                    required: getChildByClass(qelm, 'required').checked,
                    answers: []
                },
                answers = getElm('a_' + qelm.id);

            for (var j = 0; j < answers.childNodes.length; j++) {
                var aelm = answers.childNodes[j];

                q.answers.push({
                    value: aelm.firstChild.value,
                    userInput: _getAnswerChecbox(aelm),
                    // get next question&answers chain recursively
                    nextQuestion: snapshotSave(getChildByClass(aelm, 'questions'))
                });
            };

            tree.push(q);
        };

        return tree;
    }

    function restoreSnapshot(rootElm, snapshot) {
        if (!rootElm) {
            return null;
        }
        if (snapshot && snapshot.caption) {
            getElm('editCaption').value = snapshot.caption;
            getElm('editSurveyTitle').innerHTML = snapshot.caption;
            // clean state before restoring all
            rootElm.innerHTML = '';
        }

        if (snapshot && Array.isArray(snapshot.questions)) {
            for (var i = 0; i < snapshot.questions.length; i++) {
                var q = snapshot.questions[i];
                var qElm = appendQuestion(rootElm);
                qElm.querySelector('input').value = q.name;
                qElm.querySelector('select').value = q.type;
                if (q.type == 'string-single' || q.type == 'string-multiple' || q.type == 'dropdown') {
                    var quesCont = getChildByClass(qElm, 'controls');
                    var ansCont = getChildByClass(quesCont, 'add-answer');
                    ansCont.classList.remove('hidden');
                }
                if (q.required) {
                    req_check = getChildByClass(qElm, 'required');
                    req_check.checked = true;
                }
                if (q.type == 'stars') {
                    var typeSel = getElm('t_' + qElm.id);
                    var inp = typeSel.getElementsByTagName('input')[0];
                    removeClass(inp, 'hidden');
                    addClass(inp, 'stars');
                    inp.placeholder = 'Enter number of stars for input (Max is 7)';
                    inp.style.fontSize = '14px';
                    inp.type = 'number';
                    inp.setAttribute('max', 7);
                    inp.value = parseInt(q.options);
                    onEvent(inp, 'change', function () {
                        var value = parseInt(this.value);
                        var max = parseInt(this.max);
                        if (value > max) {
                            this.classList.add('border', 'border-danger');
                        } else {
                            this.classList.remove('border', 'border-danger');
                        }
                    })
                }

                if (Array.isArray(q.answers) && q.answers.length > 0) {
                    for (var j = 0; j < q.answers.length; j++) {
                        var a = q.answers[j];
                        var addAnswerBtn = qElm.querySelector('a.add-answer');
                        var aElm = appendAnswer(getElm('a_' + addAnswerBtn['data-cid']));
                        aElm.querySelector('input[type="text"]').value = a.value;
                        aElm.querySelector('input[type="checkbox"]').checked = a.userInput;

                        if (Array.isArray(a.nextQuestion)) {
                            var qContainer = createElm('ul', { className: 'questions' });
                            aElm.appendChild(qContainer);
                            restoreSnapshot(qContainer, { questions: a.nextQuestion });
                        }
                    }
                }
            }
        }
    }

    function genSurvey(title_id, ques_id, save_btn_id, add_ques_id, edit = null) {
        var questions = getElm(ques_id);

        onClick(getElm(add_ques_id), function () {
            appendQuestion(questions);
            questions.className += ' my-2';
        });
        const save_btn = getElm(save_btn_id);
        const save_url = save_btn.getAttribute('data-sportfin-href');
        const save_csrf = save_btn.getAttribute('data-sportfin-csrf');
        const save_method = save_btn.getAttribute('data-sportfin-method');
        onClick(save_btn, function () {
            var addCaption = document.getElementById('caption');
            var editCaption = document.getElementById('editCaption');
            var valueAdd = addCaption.value.trim();
            var valueEdit = editCaption.value.trim();
            var filled = true;
            if (valueAdd === '' && valueEdit === '') {
                swal('Error', 'Please fill out the title field.', 'error');
                filled = false;
            }

            var state = {
                caption: getElm(title_id).value,
                questions: snapshotSave(questions)
            };
            var title = String(state.caption)
            ajaxData = JSON.stringify(state, null, 2);
            if (filled == true) {
                $.ajax({
                    url: save_url,
                    type: save_method,
                    data: {
                        content: ajaxData,
                        title: title,
                        edit: edit
                    },
                    headers: {
                        'X-CSRFTOKEN': save_csrf,
                    },
                    success: function (res) {
                        if (res.success) {
                            swal('Success', res.success, 'success')
                                .then((value) => {
                                    $('.spinner').show();
                                    window.location.reload();
                                });
                        } else if (res.error) {
                            swal('Error', res.error, 'error');
                        }
                    },
                    error: function (res) {
                        swal('Error', 'Server error. Contact support.', 'error');
                    }
                })
            }
        });

    }


    $('.editSurvey').click(function () {
        var id = $(this).attr('data-sportfin-survey-id');
        genSurvey('editCaption', 'editQuestions', 'save_edit_snapshot', 'add_edit_question', edit = id);
        $('#editSurveyModal').modal('show');
        const jsonData = JSON.parse($(this).attr('data-sportfin-survey'));
        restoreSnapshot(getElm('editQuestions'), jsonData);
    })

    domLoaded(function () {
        genSurvey('caption', 'questions', 'save_snapshot', 'add_question');

        onClick(doc, function (evt) {
            evt = evt || event;
            elm = evt.srcElement || evt.target;

            if (elm.nodeName == 'A' && elm.className.indexOf('add-answer') != -1) {
                appendAnswer(getElm('a_' + elm['data-cid']));
            }
        });

    });

})(document);
