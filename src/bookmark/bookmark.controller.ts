import { Controller, Post, UseGuards, Body, Get, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { CreateBookmarkDto, EditBookmarkDto } from './dto'
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorators';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService : BookmarkService){}
    

    @Post()
    createBookmark(@GetUser('id') userId : number , @Body() createBookmarkDto:CreateBookmarkDto){
        return this.bookmarkService.createBookmark(userId, createBookmarkDto);
    }

    @Get()
    getBookmarksByUser(@GetUser('id') userId : number){
        return this.bookmarkService.getBookmarksByUser(userId);
    }

    @Get('id/:id')
    getBookmarksById(@GetUser('id') userId : number, @Param('id') id: number){
        return this.bookmarkService.getBookmarksById(userId, id);
    }

    @Patch('edit/:id')
    editBookmarkById(@GetUser('id') userId : number, @Param('id') bookmarkId: number, @Body() editBookMarkDto:EditBookmarkDto){
        return this.bookmarkService.editBookmarkById(userId, bookmarkId, editBookMarkDto);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteBookmarkById(@GetUser('id') userId : number, @Param('id') bookmarkId: number){
        return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
    }
}
