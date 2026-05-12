window.onload = function () {
    const apiKey = 'AIzaSyAjEyj_94p-HFjFn76t6f-sLNdugSF8LhQ';
    const blogId = '7744757304303679629';
    const baseUrl = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`;
  
    fetch(baseUrl)
      .then(response => response.json())
      .then(data => {
        if (!data.items) {
          console.error('No items found in data');
          return;
        }
  
        const sections = {
          'All': document.getElementById('populate-All'),
          'News': document.getElementById('populate-Recent'),
          'Legalbit': document.getElementById('populate-Publications'),
        };
  
        Object.keys(sections).forEach(label => {
            const filtered = label === 'All' ? data.items : data.items.filter(item => item.labels?.some(l => l.toLowerCase() === label.toLowerCase()));
            displayPosts(filtered.slice(0, 4), sections[label]);
            if (label !== 'All') {
              const viewMore = document.createElement('div');
              viewMore.innerHTML = `<div class="flex justify-center mt-20 gap-8">
                <button type=" " class="inline-block animate-float-in-from-bottom text-white mr- font-bold text-center btn  md:text-xl md:px-6 md:py-4 px-2.5 py-2 text-lg font bg-green-600 shadow-lg tracking-wider rounded-full text-white text-sm hover:bg-gray-200 hover:text-gray-900 "> <a href="${label.toLowerCase()}.html"> More ${label} Posts <i class="fas fa-arrow-right"> </i> </a></button></div>
              `;
              sections[label].appendChild(viewMore);
            }
          });
          
      })
      .catch(error => console.error('Error fetching data:', error));
  };
  
  function displayPosts(posts, container) {
    container.innerHTML = '';
    posts.forEach(item => {
      const src = item.content.match(/<img[^>]*src="([^"]*)"/)?.[1] || 'https://via.placeholder.com/600x400';
      container.innerHTML += createCard(item, src);
    });
  }
  
  function createCard(item, src) {
    // Combined author extraction that handles multiple formats
let authors = 'Unknown Author';
try {
    // Try both "ABOUT THE AUTHOR" and "Author:" formats
    const aboutAuthorMatch = item.content.match(
        /(?:ABOUT THE AUTHOR(S?)|Author:)\s*([^.]+?)(?:\s*(?:can be reached|is a member|via|\.|<\/p>|$))/i
    );
    
    if (aboutAuthorMatch) {
        const aboutAuthorText = aboutAuthorMatch[2].trim();
        
        const namePattern = /(?:[A-Z][a-z]+\.?\s*)?(?:[A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+)*)(?:\s*(?:,|\band\b|&)\s*(?:[A-Z][a-z]+\.?\s*)?(?:[A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+)*))*/g;
        
        const nameMatches = aboutAuthorText.match(namePattern);
        
        if (nameMatches && nameMatches[0]) {
            authors = nameMatches[0]
                .replace(/\s+/g, ' ')         // Collapse multiple spaces
                .replace(/\s*,\s*/g, ', ')    // Normalize commas
                .replace(/\s+\band\b\s+/g, ' and ')  // Normalize "and"
                .replace(/\s*&\s*/g, ' & ')   // Normalize ampersand
                .replace(/\b([A-Z])\.\s*/g, '$1. ')  // Normalize initials
                .trim();
        }
    }
} catch (e) {
    console.error('Error extracting author:', e);
    authors = 'Unknown Author'; // Fallback value
}
    
    return `
      <article data-aos="fade-up" class="grid bg-gray-100 text-sm md:text-base pb-5 border mb-5">
        <div class=" overflow-hidden rounded-t">
          <img src="${src}" alt="${item.title}" class="w-full h-52 md:h-80 object-center">
        </div>
        <!-- date-->
        <div class="px-2 md:px-4">
          <h3 class="mt-8 md:mt-18 text-gray-900 "> ${formatDate(item.published.split('T')[0])}</h3>
          <!-- topic-->
          <h3 class="font-bold text-base md:text-xl mt-8 md:mt-10 uppercase"> ${item.title} </h3>
          <!-- display-->
          <p class="mt-8 md:mt-18 text-gray-900"> ${item.content.replace(/<[^>]+>/g, '').split(' ').slice(0, 30).join(' ')} ... </p>
          <!-- display-->
          <button type="submit" class="block bg-green-500 text-white mt-10 md:mt-18 py-2 md:py-2 px-5 md:px-10 rounded-lg hover:bg-red-500"> <a href="http://127.0.0.1:5500//single.html?id=${item.id}"> Read More</a> </button>
        </div>
      </article>
    `;
  }
  
  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  