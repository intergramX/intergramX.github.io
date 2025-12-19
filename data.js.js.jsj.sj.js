(function (Scratch) {
  'use strict';

  class IntergramXDataExt {
    constructor() {
      this.data = {};
    }

    getInfo() {
      return {
        id: 'IntergramXDataExt',
        name: 'Api for intergramX',
        color1: '#4CAF50',
        color2: '#45a049',
        blocks: [
          {
            opcode: 'getData',
            blockType: Scratch.BlockType.REPORTER,
            text: 'получить данные',
          },
          {
            opcode: 'saveData',
            blockType: Scratch.BlockType.COMMAND,
            text: 'сохранить данные [JSON]',
            arguments: {
              JSON: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{"key": "value"}',
              },
            },
          },
          {
            opcode: 'updateData',
            blockType: Scratch.BlockType.COMMAND,
            text: 'обновить данные [JSON]',
            arguments: {
              JSON: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{"key": "new_value"}',
              },
            },
          },
          {
            opcode: 'clearData',
            blockType: Scratch.BlockType.COMMAND,
            text: 'очистить данные',
          },
        ],
      };
    }

    async getData() {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          return 'Ошибка: ' + response.status;
        }
        this.data = await response.json();
        return JSON.stringify(this.data);
      } catch (error) {
        return 'Ошибка сети';
      }
    }

    async saveData(args) {
      const jsonString = args.JSON;
      let jsonData;
      try {
        jsonData = JSON.parse(jsonString);
      } catch (e) {
        return 'Ошибка JSON';
      }

      try {
        const response = await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonData),
        });
        if (response.ok) {
          this.data = jsonData;
          return 'Сохранено';
        } else {
          return 'Ошибка HTTP: ' + response.status;
        }
      } catch (error) {
        return 'Ошибка сети';
      }
    }

    async updateData(args) {
      const jsonString = args.JSON;
      let updates;
      try {
        updates = JSON.parse(jsonString);
      } catch (e) {
        return 'Ошибка JSON';
      }

      try {
        const response = await fetch('/api/data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (response.ok) {
          const result = await response.json();
          this.data = result.data || {};
          return 'Обновлено';
        } else {
          return 'Ошибка HTTP: ' + response.status;
        }
      } catch (error) {
        return 'Ошибка сети';
      }
    }

    async clearData() {
      try {
        const response = await fetch('/api/data', { method: 'DELETE' });
        if (response.ok) {
          this.data = {};
          return 'Очищено';
        } else {
          return 'Ошибка HTTP: ' + response.status;
        }
      } catch (error) {
        return 'Ошибка сети';
      }
    }
  }

  Scratch.extensions.register(new IntergramXDataExt());
})(Scratch);
