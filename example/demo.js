Ext.application({
    name: 'BreadCrumbWizard demo',
    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: {
                type: 'vbox',
                defaultMargins: 10
            },
            items: [
                {
                    xtype: 'box',
                    html: 'Demo 1: Wizard in page'
                },
                {
                    xtype: 'button',
                    text: 'Show Wizard',
                    handler: function () {
                        var wizardContainer = Ext.ComponentQuery.query('#wizardContainer')[0];
                        wizardContainer.add({
                            xtype: 'panel',
                            title: 'Wizard Panel',
                            width: 500,
                            items: [
                                {
                                    xtype: 'breadcrumbwizard',
                                    items: [
                                        {
                                            xtype: 'box',
                                            breadCrumbTitle: 'First',
                                            html: 'First View'
                                        },
                                        {
                                            xtype: 'box',
                                            breadCrumbTitle: 'Second',
                                            html: 'Second View'
                                        },
                                        {
                                            xtype: 'box',
                                            breadCrumbTitle: 'Finish',
                                            html: 'Submit View'
                                        }
                                    ],
                                    listeners: {
                                        submit: function (wizard, submitData) {
                                            wizard.up('panel').close();
                                            Ext.Msg.alert('Notification', 'Submit Data');
                                        },
                                        close: function (wizard) {
                                            wizard.up('panel').close();
                                        }
                                    }
                                }
                            ]
                        });
                    }
                },
                {
                    xtype: 'container',
                    itemId: 'wizardContainer'
                },
                {
                    xtype: 'box',
                    html: 'Demo 2: Wizard in window'
                },
                {
                    xtype: 'button',
                    text: 'Pop up wizard window',
                    handler: function () {
                        Ext.create('widget.window', {
                            title: 'Register User',
                            width: 500,
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'breadcrumbwizard',
                                    items: [
                                        {
                                            xtype: 'container',
                                            breadCrumbTitle: 'Basic Info',
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    itemId: 'name',
                                                    fieldLabel: 'Name',
                                                    allowBlank: false
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    itemId: 'password',
                                                    fieldLabel: 'Password',
                                                    allowBlank: false
                                                }
                                            ],
                                            validate: function () {
                                                return this.down('#name').isValid() && this.down('#password').isValid();
                                            },
                                            getSubmitData: function () {
                                                return {
                                                    name: this.down('#name').getRawValue(),
                                                    password: this.down('#password').getRawValue()
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'container',
                                            breadCrumbTitle: 'Select Hobbies',
                                            layout: 'fit',
                                            items: [
                                                {
                                                    xtype: 'checkboxgroup',
                                                    itemId: 'hobbies',
                                                    columns: 2,
                                                    vertical: true,
                                                    items: [
                                                        { boxLabel: 'Coding', name: 'rb', inputValue: 'coding' },
                                                        { boxLabel: 'Sports', name: 'rb', inputValue: 'sports'},
                                                        { boxLabel: 'Music', name: 'rb', inputValue: 'music' },
                                                        { boxLabel: 'Travel', name: 'rb', inputValue: 'travel' }
                                                    ]
                                                }
                                            ],
                                            getSubmitData: function () {
                                                var hobbiesFields = this.down('#hobbies').items,
                                                    selectedHobbies = [];

                                                hobbiesFields.each(function (field) {
                                                    if (field.getValue()) {
                                                        selectedHobbies.push(field.getSubmitValue());
                                                    }
                                                })
                                                return {
                                                    hobbies: selectedHobbies.join(',')
                                                };
                                            }
                                        },
                                        {
                                            xtype: 'box',
                                            breadCrumbTitle: 'Finish',
                                            html: 'Are you sure to register yourself to this site?'
                                        }
                                    ],
                                    listeners: {
                                        submit: function (wizard, submitData) {
                                            wizard.up('window').close();
                                            Ext.Msg.alert('Notification', 'Submit Data:' + Ext.JSON.encode(submitData));
                                        },
                                        close: function (wizard) {
                                            wizard.up('window').close();
                                        },
                                        validate: function (wizard, childView) {
                                            if (childView.validate) {
                                                return childView.validate();
                                            }
                                            return true;
                                        }
                                    }
                                }
                            ]
                        }).show();
                    }
                }
            ]
        });
    }
});