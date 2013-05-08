/**
 * BreadCrumbWizard for ExtJS 4.1, a container that acts as wizard.
 * It also has breadcrumbs at the top to help navigating between views.
 *
 * The BreadCrumbWizard is based on the Extjs Container, so that it can be nested directly in the page or in a pop up window.
 * The child views can still be declared in the items config, and internally it will use card layout to switch between them.
 * The child views need one extra field 'breadCrumbTitle' to set the text be displayed in the bread crumb.
 *
 * The BreadCrumbWizard will fire three events {'validate','submit','close'}
 * The 'validate' event will be fired when leaving from the current view, so validation code can be put in the listener.
 * The 'submit' event will be fired when submit button in the last view is clicked, and the submit data is collected by calling getSubmitData on all child views.
 * Feel free to add/override the getSubmitData method in each view component.
 *
 * @author: twinssbc
 * @version 1.0.0
 * @requires BreadCrumbWizard.css
 * @xtype breadcrumbwizard
 */
Ext.define('Ext.ux.BreadCrumbWizard', {
    extend: 'Ext.container.Container',
    alias: ['widget.breadcrumbwizard'],
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    defaults: {
        cls: 'x-wizard-component'
    },
    initComponent: function () {
        var me = this,
            breadCrumbComponents = [],
            cardItems = [],
            index,
            childView;

        me.currentIndex = 0;
        for (index = 0; index < me.items.length; index += 1) {
            childView = me.items[index];
            breadCrumbComponents.push({
                xtype: 'button',
                cls: 'x-wizard-breadcrumb',
                disabledCls: 'wizard-breadcrumb-disabled',
                overCls: 'wizard-breadcrumb-over',
                pressedCls: 'wizard-breadcrumb-pressed',
                enableToggle: true,
                toggleGroup: 'breadCrumbGroup',
                allowDepress: false,
                disabled: index !== 0,
                pressed: index === 0,
                index: index,
                text: childView.breadCrumbTitle,
                listeners: {
                    toggle: function (button, pressed) {
                        if (pressed) {
                            me.switchView(this.index);
                        }
                    }
                }
            });
            cardItems.push(childView);
        }

        me.breadCrumbContainer = Ext.create('widget.container', {
            layout: 'hbox',
            items: breadCrumbComponents
        });
        me.cardContainer = Ext.create('widget.container', {
            layout: 'card',
            flex: 1,
            items: cardItems
        });
        me.items = [
            me.breadCrumbContainer,
            me.cardContainer,
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                defaults: {
                    xtype: 'button',
                    cls: 'x-wizard-navigation'
                },
                items: [
                    {
                        text: 'Next',
                        itemId: 'nextBtn',
                        handler: function () {
                            me.onNext();
                        }
                    },
                    {
                        text: 'Cancel',
                        itemId: 'cancelBtn',
                        handler: function () {
                            me.onClose();
                        }
                    }
                ]
            }
        ];

        me.addEvents(
            /**
             * @event validate
             * Fires before leaving the current view. Return false from an event listener can prevent leaving the current view
             * @param {Ext.Component} this
             * @param {Ext.Component} currentView
             */
            'validate',
            /**
             * @event submit
             * Fires when the submit button in last child view is clicked
             * @param {Ext.Component} this
             * @param {Object} submitData the submitData is collected by calling getSubmitData on each child views
             */
            'submit',
            /**
             * @event close
             * Fires when the cancel button is clicked
             * @param {Ext.Component} this
             */
            'close');
        me.callParent();
    },
    switchView: function (index) {
        var nextBtn = this.down('#nextBtn'),
            childViewCount = this.cardContainer.items.getCount();
        if (index < childViewCount) {
            this.cardContainer.getLayout().setActiveItem(index);
            this.currentIndex = index;

            if (index === childViewCount - 1) {
                nextBtn.setText('Submit');
            } else {
                nextBtn.setText('Next');
            }
        } else {
            throw new Error('Invalid view index: ' + index);
        }
    },
    onNext: function () {
        var me = this,
            nextBreadCrumbButton,
            currentIndex = me.currentIndex,
            childViews = me.cardContainer.items,
            currentView = childViews.getAt(currentIndex);

        if (this.fireEvent('validate', me, currentView) !== false) {
            if (currentIndex < childViews.getCount() - 1) {
                nextBreadCrumbButton = me.breadCrumbContainer.items.getAt(currentIndex + 1);
                nextBreadCrumbButton.enable();
                nextBreadCrumbButton.toggle();
            } else {
                me.fireEvent('submit', me, me.getSubmitData());
            }
        }
    },
    onClose: function () {
        this.fireEvent('close', this);
    },
    getSubmitData: function () {
        var submitData = {};
        this.cardContainer.items.each(function (childView) {
            if (childView.getSubmitData) {
                Ext.merge(submitData, childView.getSubmitData());
            }
        });
        return submitData;
    }
});