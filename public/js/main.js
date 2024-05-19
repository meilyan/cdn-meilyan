document.addEventListener('DOMContentLoaded', () => {
  const dropArea = document.getElementById('drop-area');
  const fileElem = document.getElementById('fileElem');
  const fileElemTrigger = document.getElementById('fileElemTrigger');
  const gallery = document.getElementById('gallery');

  localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE2MTI1MjE2LCJleHAiOjE3MTYxMjg4MTZ9.B9fVFJb2u2WP0hhSiygz-XyjdflUIjOeFzXNkCGDXiw')

  if (dropArea && fileElem && fileElemTrigger && gallery) {
      fileElemTrigger.addEventListener('click', (e) => {
          e.preventDefault();
          fileElem.click();
      });

      fileElem.addEventListener('change', handleFiles);

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
          dropArea.addEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
          dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'), false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
          dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'), false);
      });

      dropArea.addEventListener('drop', handleDrop, false);

      function preventDefaults(e) {
          e.preventDefault();
          e.stopPropagation();
      }

      function handleDrop(e) {
          const dt = e.dataTransfer;
          const files = dt.files;
          handleFiles({ target: { files } });
      }

      function handleFiles(e) {
          const files = e.target.files;
          [...files].forEach(uploadFile);
      }

      async function uploadFile(file) {
          const url = '/api/images/upload';
          const formData = new FormData();
          formData.append('image', file);

          const listItem = document.createElement('div');
          listItem.classList.add('list-item');

          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          listItem.appendChild(img);

          const fileName = document.createElement('div');
          fileName.classList.add('file-name');
          fileName.textContent = file.name;
          listItem.appendChild(fileName);

          const status = document.createElement('div');
          status.classList.add('status');
          status.textContent = 'Uploading...';
          listItem.appendChild(status);

          gallery.appendChild(listItem);

          const token = localStorage.getItem('token');
          try {
              const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                      'Authorization': `Bearer ${token}`
                  },
                  body: formData
              });
              const result = await response.json();
              if (result.error) {
                  status.textContent = 'Failed';
                  status.style.color = 'red';
              } else {
                  status.textContent = 'Uploaded';
                  const link = document.createElement('a');
                  link.href = result.imageUrl;
          link.textContent = result.imageUrl;
          link.target = '_blank';
          listItem.appendChild(link);
              }
          } catch (error) {
              status.textContent = 'Failed';
              status.style.color = 'red';
              console.error('Error:', error);
          }
      }
  }
});
