sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("ein.codes.poc.controller.Main", {

        /**
         * Lifecycle Methods
         */

        onInit: function () {
            const viewModel = new JSONModel({
                selectedPrinter: null,
                selectedPrinter2: null,
            });
            this.getView().setModel(viewModel, "viewModel");

            this._setPopoverAsTooltipImplementation();
        },

        /**
         * Event Handlers
         */

        onComboBoxSelectionChange: function (event) {
            this._handleDynamicTooltip(event)
        },

        onComboBoxSelectionChange2: function (event) {
            this._handleButtonDynamicTooltip(event)
        },



        /**
         * Private Methods
         */

        _handleDynamicTooltip: function (event) {
            const { selectedItem } = event.getParameters();
            const button = this.byId("button-01");
            const comboBox = event.getSource();

            if (!selectedItem) {
                comboBox.setTooltip("None selected");
                button.setTooltip("None selected");
                return;
            }

            const itemText = selectedItem.getText();
            const itemKey = selectedItem.getKey();

            comboBox.setTooltip(`${itemText} (${itemKey})`);
            button.setTooltip(`${itemText} (${itemKey})`);
        },

        _handleButtonDynamicTooltip: function (event) {
            const { selectedItem } = event.getParameters();
            const button = this.byId("button-02");

            if (!selectedItem) {
                button.setTooltip("None selected");
                button.setEnabled(false);
            }

            const itemText = selectedItem.getText();
            const itemKey = selectedItem.getKey();

            button.setTooltip(`${itemText} (${itemKey})`);
            button.setEnabled(true);
        },

        _setPopoverAsTooltipImplementation: function () {
            const { printers } = this.getOwnerComponent().getModel("mockModel").getData();
            const viewModel = this.getView().getModel("viewModel");
            const comboBox = this.byId("combobox-with-popover");
            let timeoutId;

            const popover = new sap.m.Popover({
                placement: sap.m.PlacementType.Bottom,
                content: new sap.m.Text({ text: "None selected" }),
                contentWidth: "350px",
                showHeader: false,
                showArrow: false,
            });

            comboBox.addEventDelegate({
                onmouseover: (event) => {
                    const { pageX, pageY } = event;
                    timeoutId = setTimeout(function () {
                        const selectedPrinter = viewModel.getProperty("/selectedPrinter2");
                        const data = printers.find((printer) => printer.key === selectedPrinter);
                        const text = data ? `${data.desc} (${data.key})` : "None selected";
                        popover.addStyleClass("sapUiContentPadding");
                        popover.setOffsetX(pageX - 250);
                        popover.setOffsetY(pageY - 300);
                        popover.getContent()[0].setText(text);
                        popover.openBy(comboBox);
                    }, 700);
                },
                onmouseout: () => {
                    // if (popover.isOpen()) popover.close();
                    clearTimeout(timeoutId);
                },
            });
        },

    });
});
